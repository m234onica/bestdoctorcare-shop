// TODO: lookup the mapping and make this async
export const getEmailFromLineUserId = userId => `${userId}@lineapp.com`

export const getEmailFromCustomer = customer => customer.email

export const getLineUserIdFromCustomer = customer => {
  const fields = customer.metafields.edges.map(e => e.node)
  const idField = fields.find(f => f.key === 'line_user_id')

  return idField && idField.value
}
