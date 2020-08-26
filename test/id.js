import { getLegacyId, getGraphQLID } from '../utils/id'

const test = require('ava')

test('#getLegacyId', t => {
  t.assert(getLegacyId('gid://shopify/DraftOrder/668686254231') === '668686254231')
  t.assert(getLegacyId('668686254231') === '668686254231')
  t.falsy(getLegacyId(null))
  t.falsy(getLegacyId())
})

test('#getGraphQLID', t => {
  t.assert(getGraphQLID('DraftOrder', '668686254231') === 'gid://shopify/DraftOrder/668686254231')
  t.assert(getGraphQLID('DraftOrder', 'gid://shopify/DraftOrder/668686254231') === 'gid://shopify/DraftOrder/668686254231')
  t.falsy(getGraphQLID('DraftOrder', null))
  t.falsy(getGraphQLID('DraftOrder'))
})
