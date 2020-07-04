import { query as q } from 'faunadb'
import faunadb from './faunadb'

async function setup () {
  await faunadb.query(q.CreateCollection({ name: 'users' }))

  await faunadb.query(
    q.CreateIndex({
      name: 'users_by_line_user_id_index',
      source: q.Collection('users'),
      terms: [{ field: ['data', 'line_user_id'] }]
    })
  )

  await faunadb.query(
    q.CreateIndex({
      name: 'users_by_shopify_customer_id_index',
      source: q.Collection('users'),
      terms: [{ field: ['data', 'shopify_customer_id'] }]
    })
  )
}

setup()
