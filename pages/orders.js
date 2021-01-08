/* eslint-env browser */
import React, { useState, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import cx from 'classnames'
import { useQuery } from 'react-query'

import { orderStatusName } from '../common/order'
import { UserContext } from '../components/UserContext'
import dayjs from '../utils/dayjs'

const Orders = () => {
  const { user } = useContext(UserContext)
  const router = useRouter()
  const [tab, setTab] = useState('order')
  const isOrderTab = tab === 'order'
  const isDiscountTab = tab === 'discount'

  const { data: orders /*, error */ } = useQuery('orders', () => fetch('/api/orders').then(r => r.json()).then(d => d.draftOrders.map(order => {
    return {
      ...order,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt)
    }
  }).sort((a, b) => b.createdAt - a.createdAt)), {
    enabled: !!user
  })

  const { data: discounts } = useQuery('discounts', () => fetch('/api/discounts').then(r => r.json()).then(d => d.discounts), {
    enabled: !!user
  })

  const onClickDiscountRow = discount => () => {
    if (!discount.usedAt) {
      return
    }

    router.push(`/orders/${discount.draftOrderId}`)
  }

  return (
    <div className='page-container'>
      <Head>
        <title>我的訂單</title>
      </Head>

      <div className='container'>
        <div className='tabs'>
          <nav className='nav nav-tabs nav-justified'>
            <a className={cx('nav-item nav-link', { active: isOrderTab })} onClick={() => setTab('order')}>檢視訂單</a>
            <a className={cx('nav-item nav-link', { active: isDiscountTab })} onClick={() => setTab('discount')}>檢視優惠券</a>
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
              <thead>
                                  <tr>
                  <th>取得日期</th>
                  <th>金額</th>
                  <th>取得原因</th>
                  <th>狀態</th>
                </tr>
                                </thead>
              <tbody>
                                  {discounts && discounts.map(discount => {
                  const used = !!discount.usedAt

                  return (<tr key={discount.id} className={cx({ used })} onClick={onClickDiscountRow(discount)}>
                    <td>{dayjs(discount.createdAt).format('YYYY/MM/DD')}</td>
                    <td>{discount.value}</td>
                    <td>{discount.title}</td>
                    <td>{used ? '已使用' : '未使用'}</td>
                          </tr>)
                })}
                                </tbody>
            </table>
          }
        </div>
      </div>
      <style jsx>{`
        table {
          border-collapse: collapse;
        }

        tr.used td {
          position: relative;
        }

        tr.used td:before {
          content: '';
          width: 100%;
          position: absolute;
          top: 50%;
          left: 0;
          border-bottom: 1px solid #111;
        }
      `}
      </style>
    </div>
  )
}
export default Orders
