import shopify from '../../../utils/shopify'
import { getLineUserIdFromCustomer } from '../../../utils/user'
import { client } from '../../../utils/line'
import { initConnection, DraftOrderRelation } from '../../../utils/models'
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

/**
 * @param {import('next/types').NextApiRequest} req
 * @param {import('next/types').NextApiResponse} res
 */
async function handler (req, res) {
  const order = req.body

  try {
    if (order.fulfillment_status === 'fulfilled') {
      await initConnection()

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
      const record = await DraftOrderRelation.findOne({
        orderId
      })

      const draftOrderIdText = record ? `訂單 #${record.draftOrderId} ` : ''

      if (customer) {
        const lineId = getLineUserIdFromCustomer(customer)

        if (lineId) {
          await client.pushMessage(lineId, [{
            type: 'text',
            text: `${draftOrderIdText}已為您發貨`
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
