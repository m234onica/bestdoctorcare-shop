import { getLegacyId, getGraphQLId } from '../utils/id'

const test = require('ava')

test('#getLegacyId', t => {
  t.assert(getLegacyId('gid://shopify/DraftOrder/668686254231') === '668686254231')
  t.assert(getLegacyId('668686254231') === '668686254231')
  t.falsy(getLegacyId(null))
  t.falsy(getLegacyId())
})

test('#getGraphQLId', t => {
  t.assert(getGraphQLId('DraftOrder', '668686254231') === 'gid://shopify/DraftOrder/668686254231')
  t.assert(getGraphQLId('DraftOrder', 'gid://shopify/DraftOrder/668686254231') === 'gid://shopify/DraftOrder/668686254231')
  t.falsy(getGraphQLId('DraftOrder', null))
  t.falsy(getGraphQLId('DraftOrder'))
})
