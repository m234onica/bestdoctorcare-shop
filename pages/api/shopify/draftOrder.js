import { upsertDraftOrderRelation } from '../../../services/order'
import { getLegacyId } from '../../../utils/id'

/**
 * @param {import('next/types').NextApiRequest} req
 * @param {import('next/types').NextApiResponse} res
 */
async function handler (req, res) {
  const draftOrder = req.body
  const orderId = getLegacyId(draftOrder.order_id)

  try {
    if (draftOrder.status === 'completed' && orderId) {
      await upsertDraftOrderRelation(orderId, getLegacyId(draftOrder.id))
    }
  } catch (err) {
    console.error(err)
  }

  res.statusCode = 200
  return res.end()
}

export default handler
