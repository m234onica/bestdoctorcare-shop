import { query as q } from 'faunadb'

import Ecpay, { parseTradeInfo } from '../utils/ecpay'
import faunadb from '../utils/faunadb'
import shopify from '../utils/shopify'

export async function run () {
  const openDraftOrders = await shopify.draftOrder.list({
    status: 'open'
  })
  const orderIds = openDraftOrders.map(order => String(order.id))

  const { data } = await faunadb.query(
    q.Map(
      q.Paginate(
        q.Union(
          ...orderIds.map(id => q.Match(q.Index('orders_by_draft_order_id_index'), id))
        )
      ),
      q.Lambda(
        'order',
        q.Get(q.Var('order'))
      )
    )
  )

  return Promise.allSettled(data.map(async d => {
    console.log(d.data.MerchantTradeNo)
    const res = await Ecpay.query_client.query_trade_info({
      MerchantTradeNo: d.data.MerchantTradeNo
    })

    if (res) {
      const paymentData = parseTradeInfo(res)
      if (paymentData.TradeStatus === '1') {
        await shopify.draftOrder.complete(Number(paymentData.CustomField1))

        // TODO: update local?
      }
    }
  }))
}
