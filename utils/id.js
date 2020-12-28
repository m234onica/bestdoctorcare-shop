// gid://shopify/DraftOrder/668686254231

/**
 *
 * @param {string} id
 */
const isGraphQLID = (id) => {
  return typeof id === 'string' && id.includes('gid://shopify')
}

/**
 * @param {string} model
 * @param {string} id
 */
export const getGraphQLID = (model, id) => {
  if (!id) {
    return id
  }

  if (isGraphQLID(id)) {
    return `${id}`
  }

  return `gid://shopify/${model}/${id}`
}

/**
 * @param {string} id
 */
export const getLegacyId = (id) => {
  if (!id) {
    return id
  }

  if (!isGraphQLID(id)) {
    return `${id}`
  }

  const m = id.match(/\d+$/)
  return m && m[0]
}
