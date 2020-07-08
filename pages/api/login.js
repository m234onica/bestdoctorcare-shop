import { query as q } from 'faunadb'

import shopify from '../../utils/shopify'
import faunadb from '../../utils/faunadb'

export default async (req, res) => {
  const lineProfile = req.body.profile

  if (!lineProfile) {
    return res.json({
      status: 'error',
      message: 'No liff account'
    })
  }

  const { userId } = lineProfile

  let entry
  try {
    entry = await faunadb.query(
      q.Get(
        q.Match(
          q.Index('users_by_line_user_id_index'),
          userId
        )
      )
    )
  } catch (e) {}

  /** @type {import('shopify-api-node').ICustomer} */
  let customer
  if (!entry) {
    // TODO: get the email from line profile
    customer = await shopify.customer.create({
      first_name: lineProfile.displayName,
      email: `${userId}@lineapp.com`,
      verified_email: true,
      send_email_welcome: false
    })

    await faunadb.query(
      q.Create(
        q.Collection('users'),
        { data: { line_user_id: userId, shopify_customer_id: customer.id } }
      )
    )
  } else {
    try {
      customer = await shopify.customer.get(entry.data.shopify_customer_id)
    } catch (e) {
      // TODO: handle customer not found
      // step:
      // 1. remove database mapping record
      // 2. try to recreate
    }
  }

  if (customer) {
    return res.json({
      status: 'ok',
      data: {
        customer
      }
    })
  } else {
    return res.json({
      status: 'error',
      description: 'Customer not found'
    })
  }
}
