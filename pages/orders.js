/* eslint-env browser */
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { orderStatusName } from '../common/order'

const Orders = () => {
  const [, setOrderId] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => {
        if (data.draftOrders) {
          console.log(data.draftOrders)
          setOrders(data.draftOrders.map(order => {
            return {
              ...order,
              createdAt: new Date(order.createdAt),
              updatedAt: new Date(order.updatedAt)
            }
          }).sort((a, b) => b.createdAt - a.createdAt))

          const params = new URLSearchParams(window.location.search)
          setOrderId(params.get('orderId'))
        }
      })
  }, [])

  return (
    <div className='page-container'>
      <Head>
        <title>所有訂單</title>
      </Head>

      <div className='container'>
        <div className='table table-striped table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>訂單編號</th>
                <th>金額</th>
                <th>狀態</th>
              </tr>
            </thead>
            <tbody>
              {
                orders.map(order => (
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
          </table>
        </div>
      </div>
    </div>
  )
}
export default Orders
