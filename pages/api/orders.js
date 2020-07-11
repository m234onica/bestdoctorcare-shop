import { query as q } from 'faunadb'

import shopify from '../../utils/shopify'
import faunadb from '../../utils/faunadb'

export default async (req, res) => {
  const { userId } = req.query

  if (!userId) {
    return res.json({
      error: 'userId is not provided'
    })
  }

  const result = await faunadb.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('orders_by_line_user_id_index'), userId)
      ),
      q.Lambda(
        'order',
        q.Get(q.Var('order'))
      )
    )
  )

  const draftOrders = await shopify.draftOrder.list({
    ids: result.data.map(order => order.data.draft_order_id).join(',')
  })
  return res.json({
    draftOrders
  })
}
