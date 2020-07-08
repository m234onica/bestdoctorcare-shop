import { v4 as uuid } from 'uuid'
import EcpayPayment from '@yukaii/ecpay_payment_nodejs'

export default async (req, res) => {
  const dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei', hour12: false })
  // '7/7/2020, 00:09:01'
  const [, m, d, y, time] = dateString.match(/(\d+)\/(\d+)\/(\d+), (.+)/)
  const now = `${y}/${m.padStart(2, '0')}/${d.padStart(2, '0')} ${time}`

  const baseParam = {
    MerchantTradeNo: uuid().replace(/-/g, '').slice(0, 20), // 請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate: now, // ex: 2017/02/13 15:45:30
    TotalAmount: '100',
    TradeDesc: '測試交易描述',
    ItemName: '測試商品等',
    ReturnURL: 'https://box.yukai.dev/api/webhook',
    EncryptType: '1',
    // PaymentInfoURL: 'https://box.yukai.dev/api/webhook',
    // OrderResultURL: 'http://192.168.0.1/payment_result',
    NeedExtraPaidInfo: 'Y'
    // ClientBackURL: 'https://www.google.com',
    // ItemURL: 'http://item.test.tw',
    // Remark: '交易備註'
  }

  const payInfoUrl = 'https://box.yukai.dev'
  const exp = '7'
  const clientRedirectURL = 'https://box.yukai.dev/api/webhook'

  const create = new EcpayPayment()
  const htm = create.payment_client.aio_check_out_atm(baseParam, payInfoUrl, exp, clientRedirectURL)

  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write(htm)
  return res.end()
}
