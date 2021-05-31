/* eslint-env browser */
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { getBankData, getPaymentType, getPaymentVirtualAccount } from '../../utils/browser'

const CompletedOrder = () => {
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const { id: orderId } = router.query

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders?orderId=${orderId}`)
        .then(r => r.json())
        .then(data => {
          console.log(data.order)
          if (data.order) {
            setOrder(data.order)
          }
        })
    }
  }, [orderId])

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

  const dueDate = useMemo(() => {
    if (order) {
      return new Date(+new Date(order.createdAt) + 7 * 24 * 60 * 60 * 1000)
    }
  }, [order])

  return order && (
    <div className='page-container'>
      <div className='text-center container'>
        <h1>已完成結帳</h1>

        {
          bankData && (
            <div>
              <p>
                請記得在 {dueDate.toString()} 前轉帳至以下銀行帳號，該帳號為本次交易專屬
              </p>

              <div>
                <h2>金額 {order.totalPrice} 元</h2>
                <h2 className='mt-2'>({bankData.code}) {bankAccount}</h2>
              </div>
            </div>
          )
        }

        <Link href='/'>
          <a>
            <button className='btn btn-default'>
              完成
            </button>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default CompletedOrder
