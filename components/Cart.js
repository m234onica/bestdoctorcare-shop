import { useContext } from 'react'
import { useRouter } from 'next/router'

import CartContext from './CartContext'

const LineItem = ({ variant, quantity }) => {
  return (
    <div>
      <img src={variant.image.src} width={50} height={50} />
      {variant.title} * {quantity} $ {variant.price}
    </div>
  )
}

export default props => {
  const { items, cartOpen, setCartOpen } = useContext(CartContext)
  const router = useRouter()

  const cartAvailablePaths = [
    '/',
    '/product'
  ]

  if (!cartAvailablePaths.includes(router.pathname)) {
    return null
  }

  const totalPrice = items.reduce((acc, { variant, quantity }) => acc + parseFloat(variant.price) * quantity, 0)

  const lineItems = items.map(item =>
    <LineItem
      variant={item.variant}
      quantity={item.quantity}
      key={item.variantId}
    />
  )

  return (
    <div className={`Cart ${cartOpen ? 'Cart--open' : ''}`}>
      <header className='Cart__header'>
        <button
          onClick={() => setCartOpen(false)}
          className='Cart__close'
        >
        ×
        </button>
      </header>
      <ul className='Cart__line-items'>
        {lineItems}
      </ul>
      <footer className='Cart__footer'>
        <div className='Cart-info clearfix'>
          <div className='Cart-info__total Cart-info__small'>Total</div>
          <div className='Cart-info__pricing'>
            <span className='pricing'>$ {totalPrice}</span>
          </div>
        </div>
        <button className='Cart__checkout button' onClick={() => setCartOpen(true)}>Checkout</button>
      </footer>
    </div>
  )
}
