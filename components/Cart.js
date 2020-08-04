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

export default () => {
  const { items, cartOpen, setCartOpen, toggleCartOpen } = useContext(CartContext)
  const { liffState } = useContext(UserContext)
  const router = useRouter()

  const cartAvailablePaths = [
    '/',
    '/product'
  ]

  if (!cartAvailablePaths.some(p => router.pathname.includes(p))) {
    return null
  }

  const totalPrice = items.reduce((acc, { variant, quantity }) => acc + parseFloat(variant.priceV2.amount) * quantity, 0)

  /*
  const lineItems = items.map(item =>
    <LineItem
      variant={item.variant}
      quantity={item.quantity}
      key={item.variantId}
    />
  )

  const checkout = () => {
    if (!liffState.profile?.userId) {
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
  */

  return (
    <div className='shopping-cart fixed-bottom d-flex justify-content-center align-items-center py-3 bg-white'>
      <button className='btn btn-large' type='button'>
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
