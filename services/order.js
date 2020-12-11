import shopify from '../utils/shopify'
import { client } from '../utils/line'
import { DraftOrderRelation } from '../utils/models'
import { getLegacyId, getGraphQLID } from '../utils/id'

export async function createDraftOrderRelation (orderId, draftOrderId) {
  const data = {
    orderId,
    draftOrderId
  }

  const record = await DraftOrderRelation.findOne(data)
  if (record) {
    await DraftOrderRelation.update(data)
  } else {
    await DraftOrderRelation.create(data)
  }
}

export class DraftOrderCompleteError extends Error {};

export async function completeDraftOrder (draftOrderId, lineUserId, tradeAmount) {
  const { draftOrderComplete: { userErrors, draftOrder } } = await shopify.graphql(`
    mutation draftOrderComplete($id: ID!) {
      draftOrderComplete(id: $id) {
        draftOrder {
          id
          order {
            id
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    id: getGraphQLID('DraftOrder', draftOrderId)
  })

  if (userErrors.length > 0) {
    throw new DraftOrderCompleteError(JSON.stringify(userErrors))
  }

  await createDraftOrderRelation(getLegacyId(draftOrder.order.id), getLegacyId(draftOrderId))

  await client.pushMessage(lineUserId, [{
    type: 'text',
    text: `已收到您付款的 ${tradeAmount} 整`
  }])
}
