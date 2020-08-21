import shopify from '../../../utils/shopify'
import { getLineUserIdFromCustomer } from '../../../utils/user'
import { client } from '../../../utils/line'

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
  const fullfillment = req.body

  try {
    if (fullfillment.fulfillment_status === 'fulfilled') {
      const { customer } = await shopify.graphql(`
        query ($customerId: ID!) {
          customer (id: $customerId) {
            ${customerField}
          }
        }
      `, {
        customerId: fullfillment.customer.admin_graphql_api_id
      })

      if (customer) {
        const lineId = getLineUserIdFromCustomer(customer)

        if (lineId) {
          await client.pushMessage(lineId, [{
            type: 'text',
            text: '已為您發貨' // TODO: query order details and numbers
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
