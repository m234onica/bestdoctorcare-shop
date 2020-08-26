import { DraftOrderRelation, initConnection } from '../utils/models'

export async function createDraftOrderRelation (orderId, draftOrderId) {
  await initConnection()
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
