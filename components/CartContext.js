import { createContext, useState } from 'react'

const CartContext = createContext()

export default CartContext

export const withCartContext = Components => (props) => {
  const [items, setCartItems] = useState([])

  const addVariantToCart = (variantId, quantity) => {
    const cartItems = [...items]
    const item = cartItems.find(i => i.variantId === variantId)

    if (item) {
      setCartItems([
        ...cartItems.filter(item => item.variantId !== variantId),
        { ...item, quantity }
      ])
    } else {
      setCartItems([
        ...items,
        {
          variantId,
          quantity
        }
      ])
    }
  }

  return (
    <CartContext.Provider value={{ items, addVariantToCart }}>
      <Components {...props} />
    </CartContext.Provider>
  )
}
