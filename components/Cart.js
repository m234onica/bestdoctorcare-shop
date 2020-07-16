/* global fetch */
import { useContext } from 'react'
import { useRouter } from 'next/router'

import CartContext from './CartContext'
import UserContext from './UserContext'

const LineItem = ({ variant, quantity }) => {
  const { addVariantToCart, removeVariantFromCart } = useContext(CartContext)

  return (
    <div className='LineItem'>
      <img src={variant.image.src} width={50} height={50} />
      {variant.title} $ {variant.price}

      <input value={quantity} type='number' min={1} onChange={(e) => addVariantToCart(variant, parseInt(e.target.value, 10))} />

      <button onClick={() => removeVariantFromCart(variant.id)}>x</button>
    </div>
  )
}

const submitForm = ({ method = 'POST', action, values }) => {
  const form = document.createElement('form')

  values.forEach(({ name, value }) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  })

  form.method = method
  form.action = action

  document.body.appendChild(form)
  form.submit()
}

export default props => {
  const { items, cartOpen, setCartOpen, toggleCartOpen } = useContext(CartContext)
  const { liffState } = useContext(UserContext)
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

  const checkout = () => {
    if (!liffState.profile.userId) {
      return
    }

    const shippingAddress = {
      firstName: 'Shipping address first name',
      address1: 'address 1',
      address2: 'address 2',
      country: 'Taiwan',
      company: 'momokatw',
      phone: '+886914321234',
      zip: '12312'
    }

    const note = Object.entries({
      shippingTime: '中午前、中午後',
      shippingType: '收貨方式??',
      note: '備註'
    }).map(([key, value]) => `${key}: ${value}`).join('\n')

    fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        userId: liffState.profile.userId,
        lineItems: items.map(({ variantId, quantity }) => ({ variantId, quantity })),
        shippingAddress,
        note
        // TODO: stringify checkout payloads
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(r => r.json())
      .then(data => {
        submitForm(data)
      })
  }

  return (
    <div className={`Cart ${cartOpen ? 'Cart--open' : ''}`}>
      <header className='Cart__header'>
        <div className='Cart__header_clickarea' onClick={toggleCartOpen} />
        <div
          onClick={() => setCartOpen(false)}
          className='Cart__close'
        >
          {cartOpen ? 'x' : '結帳'}
        </div>
      </header>

      <section className='Cart__body'>
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
          <button className='Cart__checkout button' onClick={checkout}>Checkout</button>
        </footer>
      </section>

      <style jsx>{`
        .Cart {
          position: fixed;
          top: 0;
          height: 100%;
          width: 100%;
          background-color: white;
          display: flex;

          transform: translateY(calc(100% - 60px));
          transition: transform .5s ease-in-out;
        }

        .Cart__header {
          position: absolute;
          top: 0;
          display: flex;
          justify-content: flex-end;
          height: 60px;
          align-items: center;
          width: 100%;
          padding: 0 15px;

          border: solid 1px #eee;
          background-color: #fefefe;
          border-width: 1px 0;
        }

        .Cart__body {
          padding: 60px 15px 10px;
          width: 100%;
        }

        .Cart__header_clickarea {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .Cart.Cart--open {
          transform: translateY(0);
          transition: transform 300ms ease-in-out;
        }

        .Cart.Cart--open {
          top: 0;
        }

        .Cart__line-items {
          padding-inline-start: 0;
        }
      `}
      </style>
    </div>
  )
}