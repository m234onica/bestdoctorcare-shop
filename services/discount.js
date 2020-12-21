import shortId from 'shortid'

import { client } from '../utils/line'
import { getGraphQLID, getLegacyId } from '../utils/id'
import shopify, { customerFragment, findCustomerFromLineUserId } from '../utils/shopify'
import { getLineUserIdFromCustomer } from '../utils/user'
import primsa from '../utils/prisma'

const getCustomer = async customerId => {
  const { customer } = await shopify.graphql(`
    query ($customerId: ID!) {
      customer (id: $customerId) {
        ...customerFields
      }
    }
    ${customerFragment}
  `, {
    customerId: getGraphQLID('Customer', customerId)
  })

  return customer
}

export async function notifyInvitationComplete (userId, invitedUserId) {
  console.log(`${userId}, ${invitedUserId}`)
  const customer = await getCustomer(userId)
  const invitedCustomer = await getCustomer(invitedUserId)

  if (customer) {
    const customerLineId = getLineUserIdFromCustomer(customer)

    if (customerLineId) {
      try {
        await client.pushMessage(customerLineId, [{
          type: 'text',
          text: '您的朋友已加入成功，恭喜你獲得一組優惠折價券'
        }])
      } catch (err) {
        console.error(err)
      }
    }
  }

  if (invitedCustomer) {
    const invitedCustomerLineId = getLineUserIdFromCustomer(invitedCustomer)

    if (invitedCustomerLineId) {
      try {
        await client.pushMessage(invitedCustomerLineId, [{
          type: 'text',
          text: '邀請碼使用成功，恭喜你獲得一組優惠折價券'
        }])
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export async function createDiscountFromInvitation (invitation) {
  const { userId, invitedUserId } = invitation

  for (const uid of [userId, invitedUserId]) {
    const code = shortId.generate()
    await primsa.discount.create({
      data: {
        userId: getLegacyId(uid),
        title: '朋友邀請折扣',
        value: '-50', // TODO: Change this
        code,
        valueType: 'FIXED_AMOUNT'
      }
    })
  }
}

export async function getAvailableDiscountsFromCustomer (customer) {
  const userId = getLegacyId(customer.id)

  return primsa.discount.findMany({
    where: {
      userId,
      usedAt: {
        not: null
      }
    }
  })
}

export async function findAvailableDiscountFromCode (customer, code) {
  const userId = getLegacyId(customer.id)

  return primsa.discount.findFirst({
    where: {
      userId,
      code,
      usedAt: {
        not: null
      }
    }
  })
}

export async function createDiscountFromLineUserId (lineUserId) {
  const customer = await findCustomerFromLineUserId(lineUserId)

  if (!customer) {
    throw new Error('Shopify customer not found')
  }

  const code = shortId.generate()
  await primsa.discount.create({
    data: {
      userId: customer.legacyResourceId,
      title: '意見回饋折扣',
      value: '-50', // TODO: Change this
      code,
      valueType: 'FIXED_AMOUNT'
    }
  })
}
