import { v4 as uuid } from 'uuid'
import cheerio from 'cheerio'

import Ecpay from '../../utils/ecpay'
import shopify from '../../utils/shopify'
import { getLineUserIdFromCustomer } from '../../utils/user'
import { withSession } from '../../utils/session'
import { findAvailableDiscountFromCode, useDiscount } from '../../services/discount'

function parseFormData (html) {
  const $ = cheerio.load(html)
  const values = $('input').map(function () {
    return { name: $(this).attr('name'), value: $(this).attr('value') }
  }).toArray()
  const action = $('form').attr('action')
  const method = $('form').attr('method')

  return {
    action,
    method,
    values
  }
}

export default withSession(async (req, res) => {
  const { lineItems, shippingAddress, note, discountCode } = req.body
  const { user } = req.session

  if (!user) {
    return res.json({
      error: 'Login required'
    })
  }

  if (!lineItems || !Array.isArray(lineItems)) {
    return res.json({
      error: 'lineItems is required and should be Array'
    })
  }

  if (req.method !== 'POST') {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.write('Not Found')
    return res.end()
  }

  let appliedDiscount
  let discount
  if (discountCode) {
    // fill in applied discount
    discount = await findAvailableDiscountFromCode(user, discountCode)

    if (discount) {
      appliedDiscount = {
        title: discount.title,
        description: discount.description,
        value: Math.abs(parseFloat(discount.value)),
        valueType: discount.valueType
      }
    }
  }

  let order
  const ecpayOrderId = uuid().replace(/-/g, '').slice(0, 20)
  try {
    const { draftOrderCreate: { draftOrder, userErrors } } = await shopify.graphql(`
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
          legacyResourceId
          totalPrice
          customer {
            id
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
      input: {
        email: user.email,
        useCustomerDefaultAddress: true,
        lineItems,
        metafields: [
          {
            key: 'ecpay_order_id',
            namespace: 'ecpay',
            value: ecpayOrderId,
            valueType: 'STRING'
          }
        ],
        shippingAddress,
        note,
        appliedDiscount
      }
    })

    if (userErrors.length > 0) {
      console.error('Cannot create draftOrder')
      console.error(userErrors)
      return res.json({
        error: userErrors
      })
    }

    if (discount) {
      await useDiscount(discount.id, draftOrder.legacyResourceId)
    }

    order = draftOrder
  } catch (error) {
    console.error('draftOrder request error')
    console.error(error)
    return res.json({
      error: JSON.stringify(error)
    })
  }

  if (!order.defaultAddress || shippingAddress) {
    const { customerUpdate: { userErrors } } = await shopify.graphql(`
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          userErrors {
            field
            message
          }
        }
      }
    `, {
      input: {
        id: order.customer.id,
        addresses: [shippingAddress]
      }
    })

    if (userErrors.length > 0) {
      console.error('Update customer address failed')
      console.error(userErrors)
    }
  }

  // '7/7/2020, 00:09:01'
  const dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei', hour12: false })
  const [, m, d, y, time] = dateString.match(/(\d+)\/(\d+)\/(\d+), (.+)/)
  // now should be in the format: 2017/02/13 15:45:30
  const tradeDate = `${y}/${m.padStart(2, '0')}/${d.padStart(2, '0')} ${time}`

  const baseParam = {
    MerchantTradeNo: ecpayOrderId,
    MerchantTradeDate: tradeDate,
    TotalAmount: `${parseInt(Math.round(parseFloat(order.totalPrice)), 10)}`,
    TradeDesc: '測試交易描述', // TODO: fill description
    ItemName: '測試商品等', // TODO: item name
    ReturnURL: `${process.env.NEXT_PUBLIC_LIFF_DOMAIN}api/paymentSuccess`,
    EncryptType: '1',
    NeedExtraPaidInfo: 'Y',
    CustomField1: String(order.id),
    CustomField2: getLineUserIdFromCustomer(user),
    CustomField3: String(order.legacyResourceId)
  }

  const payInfoUrl = process.env.NEXT_PUBLIC_LIFF_DOMAIN
  const exp = '7'
  const clientRedirectURL = `${process.env.NEXT_PUBLIC_LIFF_DOMAIN}api/completeCheckout`

  const html = Ecpay.payment_client.aio_check_out_atm(baseParam, payInfoUrl, exp, clientRedirectURL)

  return res.json(parseFormData(html))
})
