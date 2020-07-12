/* eslint-disable-next-line */
import * as http from 'http'
import { query as q } from 'faunadb'
import faunadb from '../../utils/faunadb'

// BankCode: 806
// ExpireDate: 2020/07/14
// MerchantID: 3118899
// MerchantTradeNo: ad7aad3617f24a479aab
// PaymentType: ATM_TACHONG
// RtnCode: 2
// RtnMsg: Get VirtualAccount Succeeded
// TradeAmt: 100
// TradeDate: 2020/07/07 21:25:25
// TradeNo: 2007072125136486
// vAccount: 3453701964097315
// StoreID:
// CustomField1:
// CustomField2:
// CustomField3:
// CustomField4:
// CheckMacValue: 887DC8D332DB9986D44BAB064D483558E46D75C058410357DACD384458340185

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
export default async function (req, res) {
  if (req.method !== 'POST') {
    res.writeHead(301,
      { Location: '/' }
    )
    return res.end()
  }

  const order = req.body

  await faunadb.query(
    q.Create(
      q.Collection('orders'),
      {
        data: {
          draft_order_id: order.CustomField1,
          line_user_id: order.CustomField2,
          ecpay_order_id: order.MerchantTradeNo,
          ...order
        }
      }
    )
  )

  res.writeHead(301,
    { Location: `/orders?orderId=${order.CustomField1}` } // Render orders
  )
  return res.end()
}
