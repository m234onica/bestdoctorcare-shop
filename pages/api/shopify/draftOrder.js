import { DraftOrderRelation, initConnection } from '../../../utils/models'

/**
 * @param {import('next/types').NextApiRequest} req
 * @param {import('next/types').NextApiResponse} res
 */
async function handler (req, res) {
  const draftOrder = req.body
  const orderId = draftOrder.order_id

  try {
    if (draftOrder.status === 'completed' && orderId) {
      await initConnection()
      const data = {
        orderId,
        draftOrderId: draftOrder.id
      }

      const record = await DraftOrderRelation.findOne(data)
      if (record) {
        await DraftOrderRelation.update(data)
      } else {
        await DraftOrderRelation.create(data)
      }
    }
  } catch (err) {
    console.error(err)
  }

  res.statusCode = 200
  return res.end()
}

export default handler
