import { v4 as uuid } from 'uuid'
import cheerio from 'cheerio'
import Ecpay from '../../utils/ecpay'
import shopify from '../../utils/shopify'
import { geteEmailFromUserId } from '../../utils/user'

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

export default async (req, res) => {
  const { lineItems, userId, shippingAddress } = req.body

  if (!lineItems || !Array.isArray(lineItems)) {
    return res.json({
      error: 'lineItems is required and should be Array'
    })
  }

  if (!userId) {
    return res.json({
      error: 'userId is required'
    })
  }

  if (req.method !== 'POST') {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.write('Not Found')
    return res.end()
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
        email: geteEmailFromUserId(userId),
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
        shippingAddress
      }
    })

    if (userErrors.length > 0) {
      return res.json({
        error: userErrors
      })
    }

    order = draftOrder
  } catch (error) {
    return res.json({
      error
    })
  }

  console.log(`input = ${JSON.stringify({
    input: {
      customer: {
        id: order.customer.id
      },
      addresses: [shippingAddress]
    }
  })}`)

  // TODO: update customer default address
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
    CustomField2: userId,
    CustomField3: String(order.legacyResourceId)
  }

  const payInfoUrl = process.env.NEXT_PUBLIC_LIFF_DOMAIN
  const exp = '7'
  const clientRedirectURL = `${process.env.NEXT_PUBLIC_LIFF_DOMAIN}api/completeCheckout`

  const html = Ecpay.payment_client.aio_check_out_atm(baseParam, payInfoUrl, exp, clientRedirectURL)

  return res.json(parseFormData(html))
}
