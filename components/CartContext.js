import { createContext, useState } from 'react'

const CartContext = createContext()

export default CartContext

export const withCartContext = Components => (props) => {
  const [items, setCartItems] = useState([])

  const addVariantToCart = (variant, quantity) => {
    const variantId = variant.id
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
          variant,
          variantId,
          quantity
        }
      ])
    }
  }

  const removeVariantFromCart = (variantId) => {
    setCartItems(items.filter(item => item.variantId !== variantId))
  }

  const [cartOpen, setCartOpen] = useState(false)
  const toggleCartOpen = () => {
    setCartOpen(!cartOpen)
  }

  return (
    <CartContext.Provider value={{
      items,
      addVariantToCart,
      cartOpen,
      setCartOpen,
      toggleCartOpen,
      removeVariantFromCart
    }}
    >
      <Components {...props} />
    </CartContext.Provider>
  )
}
