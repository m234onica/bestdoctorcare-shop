import shopify from '../../utils/shopify'
import { client } from '../../utils/line'
import { getBankData } from '../../utils/browser'

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
 * @param {import('next/types').NextApiRequest} req
 * @param {import('next/types').NextApiResponse} res
 */
export default async function CompleteCheckout (req, res) {
  if (req.method !== 'POST') {
    res.writeHead(301,
      { Location: '/' }
    )
    return res.end()
  }

  const order = req.body

  const { draftOrderUpdate: { userErrors } } = await shopify.graphql(`
    mutation draftOrderUpdate($id: ID!, $input: DraftOrderInput!) {
      draftOrderUpdate(id: $id, input: $input) {
        draftOrder {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    id: order.CustomField1,
    input: {
      metafields: [
        {
          key: 'ecpay_payment_type',
          namespace: 'ecpay',
          value: order.PaymentType,
          valueType: 'STRING'
        },
        {
          key: 'ecpay_virtual_account',
          namespace: 'ecpay',
          value: order.vAccount,
          valueType: 'STRING'
        }
      ]
    }
  })

  if (userErrors.length > 0) {
    return res.status(500).write(userErrors)
  }

  const bankData = getBankData(order.PaymentType)

  try {
    await client.pushMessage(order.CustomField2, [
      {
        type: 'text',
        text: '您已完成結帳，請記得付款'
      },
      {
        type: 'text',
        text: `NT$ ${order.TradeAmt} 元\n(${bankData.code}) ${order.vAccount}`
      }
    ])
  } catch (err) {
    console.error(err)
  }

  res.writeHead(301,
    { Location: `/completed/${order.CustomField3}` } // Render orders
  )
  return res.end()
}
