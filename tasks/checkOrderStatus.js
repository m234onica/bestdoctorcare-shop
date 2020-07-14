import Ecpay, { parseTradeInfo } from '../utils/ecpay'
import shopify from '../utils/shopify'

export async function run () {
  let c = null
  let results = []
  for (;;) {
    const { draftOrders: { edges, pageInfo: { hasNextPage } } } = await shopify.graphql(`
    query ($cursor: String) {
      draftOrders (first: 50, query: "status:OPEN", after: $cursor, sortKey: UPDATED_AT) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            id
            legacyResourceId
            metafields (first: 5, namespace: "ecpay") {
              edges {
                node {
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  `, {
      cursor: c
    })

    results = results.concat(edges)

    if (hasNextPage) {
      c = edges[0].cursor
    } else {
      break
    }
  }

  const ecpayOrderIds = results.map(edge => {
    const e = edge.node.metafields.edges.find(edge => edge.node.key === 'ecpay_order_id')
    return e && e.node.value
  }).filter(Boolean)

  // TODO: watch and remove this later
  console.log(ecpayOrderIds)

  return Promise.allSettled(ecpayOrderIds.map(async ecpayOrderId => {
    const res = await Ecpay.query_client.query_trade_info({
      MerchantTradeNo: ecpayOrderId
    })

    if (res) {
      const paymentData = parseTradeInfo(res)
      if (paymentData.TradeStatus === '1') {
        // TODO: change this graphql mutation
        await shopify.draftOrder.complete(Number(paymentData.CustomField3))
      }
    }
  }))
}
