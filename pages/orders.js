/* global fetch */
import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import UserContext, { withUserContext } from '../components/UserContext'

export default withUserContext(() => {
  const [highlightedOrderId, setOrderId] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setOrderId(params.get('orderId'))
  }, [])

  const { profile } = useContext(UserContext)
  useEffect(() => {
    const userId = profile?.userId
    if (userId) {
      fetch(`/api/orders?userId=${userId}`)
        .then(r => r.json())
        .then(data => {
          if (data.draftOrders) {
            setOrders(data.draftOrders)
          }
        })
    }
  }, [profile?.userId])

  return (
    <div>
      <Header />
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
                  <td>{order.legacyResourceId}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.status}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
})
