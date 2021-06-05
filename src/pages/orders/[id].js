/* eslint-env browser */
import { useRouter } from 'next/router'
import React, { useContext, useMemo } from 'react'
import { Card } from 'react-bootstrap'
import { useQuery } from 'react-query'
import classNames from 'classnames'

import { getBankData, getPaymentType, getPaymentVirtualAccount } from '../../utils/browser'
import { orderStatusName } from '../../common/order'
import { UserContext } from '../../components/UserContext'

const Order = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { id: orderId } = router.query

  const { data } = useQuery('order', () => fetch(`/api/orders?orderId=${orderId}`).then(r => r.json()), {
    enabled: !!orderId && !!user,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const order = data?.order

  const bankData = useMemo(() => {
    if (order) {
      return getBankData(getPaymentType(order))
    }
  }, [order])

  const bankAccount = useMemo(() => {
    if (order) {
      return getPaymentVirtualAccount(order)
    }
  }, [order])

  return (
    <div className='page-container px-2'>
      <h1 className='text-center'>訂單編號 {orderId}</h1>

      {
        order && (
          <div className='container px-3'>
            <span className={classNames('badge', { 'badge-success': order.status === 'COMPLETED', 'badge-warning': order.status === 'OPEN' })}>
              {orderStatusName[order.status]}
            </span>
          </div>
        )
      }

      <div className='container px-3 table table-striped table-responsive'>
        <h3>購物明細</h3>

        {
          order && (
            <div>
              <table className='table table-striped'>
                <thead className='thead'>
                  <tr>
                    <th>商品名稱</th>
                    <th>數量</th>
                    <th>單價</th>
                    <th>小計</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lineItems.edges.map(e => {
                    const item = e.node
                    return (
                      <tr key={item.id}>
                        <td>{item.product?.title}</td>
                        <td>{item.quantity}</td>
                        <td>{item.originalTotal / item.quantity}</td>
                        <td>{item.originalTotal}</td>
                      </tr>
                    )
                  }
                  )}
                </tbody>
              </table>

              <div className='text-right'>
                {
                  order.appliedDiscount && <>
                    使用折扣 -{order.appliedDiscount.amountV2.amount} ({order.appliedDiscount.title})
                    <br />
                  </>
                }
                總金額： NT$ {order.totalPrice}
              </div>

              <h3>付款資訊</h3>

              {
                bankData && (
                  <Card>
                    <Card.Body>
                      {bankData.name} <br />
                    ({bankData.code}) {bankAccount} <br />
                    NT$ {order.totalPrice}
                    </Card.Body>
                  </Card>
                )
              }

              <h3>寄送資訊</h3>

              {
                order.shippingAddress && (
                  <Card>
                    <Card.Body>
                      {order.shippingAddress.zip} {order.shippingAddress.city} {order.shippingAddress.province} <br />
                      {order.shippingAddress.address1} <br /><br />
                      {order.shippingAddress.firstName} {order.shippingAddress.phone}
                    </Card.Body>
                  </Card>
                )
              }

            </div>
          )
        }
      </div>
    </div>
  )
}

export default Order