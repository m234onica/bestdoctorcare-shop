import { v4 as uuid } from 'uuid'
import cheerio from 'cheerio'
import Ecpay from '../../utils/ecpay'
import shopify from '../../utils/shopify'

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
  const { lineItems, userId } = req.body

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
  try {
    const { draftOrderCreate: { draftOrder, userErrors } } = await shopify.graphql(`
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
          legacyResourceId
          totalPrice
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
      input: {
        email: `${userId}@lineapp.com`, // TODO: fill customer email explicitly
        useCustomerDefaultAddress: true,
        lineItems
      }
    })

    if (userErrors.length > 0) {
      return res.json({
        error: userErrors
      })
    }

    order = draftOrder
  } catch (e) {
    return res.json({
      error: e.response.body
    })
  }

  // '7/7/2020, 00:09:01'
  const dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei', hour12: false })
  const [, m, d, y, time] = dateString.match(/(\d+)\/(\d+)\/(\d+), (.+)/)
  // now should be in the format: 2017/02/13 15:45:30
  const now = `${y}/${m.padStart(2, '0')}/${d.padStart(2, '0')} ${time}`

  const baseParam = {
    MerchantTradeNo: uuid().replace(/-/g, '').slice(0, 20),
    MerchantTradeDate: now,
    TotalAmount: `${parseInt(Math.round(parseFloat(order.totalPrice)), 10)}`,
    TradeDesc: '測試交易描述', // TODO: fill description
    ItemName: '測試商品等', // TODO: item name
    ReturnURL: `${process.env.NEXT_PUBLIC_LIFF_DOMAIN}api/paymentSuccess`,
    EncryptType: '1',
    NeedExtraPaidInfo: 'Y',
    CustomField1: String(order.legacyResourceId),
    CustomField2: userId
  }

  const payInfoUrl = process.env.NEXT_PUBLIC_LIFF_DOMAIN
  const exp = '7'
  const clientRedirectURL = `${process.env.NEXT_PUBLIC_LIFF_DOMAIN}api/completeCheckout`

  const html = Ecpay.payment_client.aio_check_out_atm(baseParam, payInfoUrl, exp, clientRedirectURL)

  return res.json(parseFormData(html))
}
