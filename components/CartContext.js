import { createContext, useState, useMemo } from 'react'

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

  const totalPrice = useMemo(() => items.reduce((acc, { variant, quantity }) => acc + parseFloat(variant.priceV2.amount) * quantity, 0), [items])

  return (
    <CartContext.Provider value={{
      items,
      totalPrice,
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
