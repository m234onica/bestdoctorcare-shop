import shopify from '../../../utils/shopify'
import { getLineUserIdFromCustomer } from '../../../utils/user'
import { client } from '../../../utils/line'
import prisma from '../../../utils/prisma'
import { getLegacyId } from '../../../utils/id'

const customerField = `
metafields (first: 10, namespace: "line") {
  edges {
    node {
      key
      value
      valueType
    }
  }
}
`

const getShippingCode = order => {
  return order.fulfillments?.[0]?.tracking_number
}

/**
 * @param {import('next/types').NextApiRequest} req
 * @param {import('next/types').NextApiResponse} res
 */
async function handler (req, res) {
  const order = req.body

  try {
    if (order.fulfillment_status === 'fulfilled') {
      const { customer } = await shopify.graphql(`
        query ($customerId: ID!) {
          customer (id: $customerId) {
            ${customerField}
          }
        }
      `, {
        customerId: order.customer.admin_graphql_api_id
      })

      // fetch draftOrder Id
      const orderId = getLegacyId(order.id)
      const record = await prisma.draftOrderRelation.findFirst({
        where: {
          orderId
        }
      })

      const draftOrderIdText = record ? `#${record.draftOrderId} ` : ''
      const shippingCode = getShippingCode(order)
      const shippingText = shippingCode ? `，貨運追蹤碼 ${shippingCode}` : ''

      if (customer) {
        const lineId = getLineUserIdFromCustomer(customer)

        if (lineId) {
          await client.pushMessage(lineId, [{
            type: 'text',
            text: `您的訂單 ${draftOrderIdText} 已出貨${shippingText}`
          }])
        }
      }
    }
  } catch (err) {
    console.error(err)
  }

  res.statusCode = 200
  return res.end()
}

export default handler
