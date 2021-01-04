/* eslint-env browser */
import React, { useState, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import cx from 'classnames'
import { useQuery } from 'react-query'

import { orderStatusName } from '../common/order'
import { UserContext } from '../components/UserContext'

const Orders = () => {
  const { user } = useContext(UserContext)
  const [tab, setTab] = useState('order')
  const isOrderTab = tab === 'order'
  const isCouponTab = tab === 'coupon'

  const { data: orders /*, error */ } = useQuery('orders', () => fetch('/api/orders').then(r => r.json()).then(d => d.draftOrders.map(order => {
    return {
      ...order,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt)
    }
  }).sort((a, b) => b.createdAt - a.createdAt)), {
    enabled: !!user
  })

  return (
    <div className='page-container'>
      <Head>
        <title>我的訂單</title>
      </Head>

      <div className='container'>
        <div className='tabs'>
          <nav className='nav nav-tabs nav-justified'>
            <a className={cx("nav-item nav-link", { active: isOrderTab })} onClick={() => setTab('order')}>檢視訂單</a>
            <a className={cx("nav-item nav-link", { active: isCouponTab })} onClick={() => setTab('coupon')}>檢視優惠券</a>
          </nav>
        </div>

        <div className='table table-striped table-responsive'>
          {
            tab === 'order' ? <table className='table'>
                <thead>
                  <tr>
                    <th>訂單編號</th>
                    <th>金額</th>
                    <th>狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    orders && orders.map(order => (
                      <tr key={order.id}>
                        <td>
                          <Link href='/orders/[id]' as={`/orders/${order.legacyResourceId}`}>
                            <a>{order.legacyResourceId}</a>
                          </Link>
                        </td>
                        <td>NT$ {order.totalPrice}</td>
                        <td>{orderStatusName[order.status]}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table> : <table className='table'>

            </table>
          }
        </div>
      </div>
    </div>
  )
}
export default Orders
