/* global fetch */
import { v4 as uuid } from 'uuid'
import cheerio from 'cheerio'
import EcpayPayment from '@yukaii/ecpay_payment_nodejs'
import FormData from 'form-data'

function requestWithFormHTML (html) {
  const $ = cheerio.load(html)
  const $form = $('form')
  const action = $form.attr('action')
  const method = $form.attr('method')

  const form = new FormData()

  $('input').each(function (i, elem) {
    form.append($(this).attr('name'), $(this).attr('value'))
  })

  return fetch(action, {
    method, body: form
  })
}

export default async (req, res) => {
  const dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei', hour12: false })
  // '7/7/2020, 00:09:01'
  const [, m, d, y, time] = dateString.match(/(\d+)\/(\d+)\/(\d+), (.+)/)
  const now = `${y}/${m.padStart(2, '0')}/${d.padStart(2, '0')} ${time}`

  // 參數值為[PLEASE MODIFY]者，請在每次測試時給予獨特值
  // 若要測試非必帶參數請將base_param內註解的參數依需求取消註解 //
  const baseParam = {
    MerchantTradeNo: uuid().replace(/-/g, '').slice(0, 20), // 請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate: now, // ex: 2017/02/13 15:45:30
    TotalAmount: '100',
    TradeDesc: '測試交易描述',
    ItemName: '測試商品等',
    ReturnURL: 'https://box.yukai.dev/api/webhook',
    EncryptType: '1'
    // OrderResultURL: 'http://192.168.0.1/payment_result',
    // NeedExtraPaidInfo: '1',
    // ClientBackURL: 'https://www.google.com',
    // ItemURL: 'http://item.test.tw',
    // Remark: '交易備註'
  }

  const payInfoUrl = 'https://box.yukai.dev'
  const exp = '7'
  const cliRedirUrl = 'https://box.yukai.dev'

  const create = new EcpayPayment()
  const htm = create.payment_client.aio_check_out_atm(baseParam, payInfoUrl, exp, cliRedirUrl, {})

  const fetchRes = await requestWithFormHTML(htm)
  return res.send(await fetchRes.text())
}
