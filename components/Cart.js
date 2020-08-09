import { useContext } from 'react'
import { useRouter } from 'next/router'

import CartContext from './CartContext'

export default () => {
  const { totalPrice } = useContext(CartContext)
  const router = useRouter()

  const cartAvailablePaths = [
    '/',
    '/cart',
    '/product/[id]'
  ]

  if (!cartAvailablePaths.some(p => router.pathname === p)) {
    return null
  }

  return (
    <div className='shopping-cart fixed-bottom d-flex justify-content-center align-items-center py-3 bg-white'>
      <button className='btn btn-large' type='button' onClick={() => router.push('/cart')}>
        結帳 總金額 NT$ ${totalPrice}
      </button>
      <style jsx>{`
        .shopping-cart {
          box-shadow: 0px -12px 65px rgba(0, 0, 0, 0.06);
        }
      `}
      </style>
    </div>
  )
}
