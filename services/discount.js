import { client } from '../utils/line'
import { getGraphQLID } from '../utils/id'
import shopify, { customerFragment } from '../utils/shopify'
import { getLineUserIdFromCustomer } from '../utils/user'

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