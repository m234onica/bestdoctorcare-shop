import { v4 as uuid } from 'uuid'
import cheerio from 'cheerio'
import EcpayPayment from '@yukaii/ecpay_payment_nodejs'
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
  // TODO: form validation
  // TODO: req.method validation

  const draftOrder = await shopify.draftOrder.create({
    email: 'U4b1e176a9359872cd9ec6a2e4b01dc64@lineapp.com', // TODO: fill customer email explicitly
    use_customer_default_address: true,
    line_items: [
      {
        variant_id: 34935559520407, // TODO: get line items from url param
        quantity: 1
      }
    ]
    // TODO: shipping info
  })

  // '7/7/2020, 00:09:01'
  const dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei', hour12: false })
  const [, m, d, y, time] = dateString.match(/(\d+)\/(\d+)\/(\d+), (.+)/)
  // now should be in the format: 2017/02/13 15:45:30
  const now = `${y}/${m.padStart(2, '0')}/${d.padStart(2, '0')} ${time}`

  const baseParam = {
    MerchantTradeNo: uuid().replace(/-/g, '').slice(0, 20),
    MerchantTradeDate: now,
    TotalAmount: '100',
    TradeDesc: '測試交易描述',
    ItemName: '測試商品等',
    ReturnURL: `${process.env.NEXT_PUBLIC_LIFF_DOMAIN}api/paymentSuccess`,
    EncryptType: '1',
    NeedExtraPaidInfo: 'Y',
    CustomField1: String(draftOrder.id),
    CustomField2: String('U4b1e176a9359872cd9ec6a2e4b01dc64') // TODO: Line User ID
  }

  const payInfoUrl = process.env.NEXT_PUBLIC_LIFF_DOMAIN
  const exp = '7'
  const clientRedirectURL = `${process.env.NEXT_PUBLIC_LIFF_DOMAIN}api/completeCheckout`

  const create = new EcpayPayment()
  const html = create.payment_client.aio_check_out_atm(baseParam, payInfoUrl, exp, clientRedirectURL)

  return res.json(parseFormData(html))
}
