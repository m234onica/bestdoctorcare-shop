/* global fetch */
import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import UserContext from '../components/UserContext'

export default () => {
  const [highlightedOrderId, setOrderId] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setOrderId(params.get('orderId'))
  }, [])

  const { liffState } = useContext(UserContext)
  useEffect(() => {
    const userId = liffState?.profile?.userId
    if (userId) {
      fetch(`/api/orders?userId=${userId}`)
        .then(r => r.json())
        .then(data => {
          if (data.draftOrders) {
            setOrders(data.draftOrders)
          }
        })
    }
  }, [liffState?.profile?.userId])

  return (
    <div className='page-container'>
      <Head>
        <title>所有訂單</title>
      </Head>

      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>price</th>
            <th>status</th>
          </tr>
        </thead>
        <tbody>
          {
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.total_price}</td>
                <td>{order.status}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
