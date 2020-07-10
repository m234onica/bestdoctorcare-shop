import { useState, useContext } from 'react'
import CartContext from './CartContext'

export default ({ product }) => {
  const variantImage = product.images.edges[0].node.src
  const variant = product.variants.edges[0].node
  const [variantQuantity, setVariantQuantity] = useState(1)
  const { addVariantToCart } = useContext(CartContext)

  const handleQuantityChange = (e) => {
    setVariantQuantity(parseInt(e.target.value, 10))
  }

  return (
    <div className='Product'>
      {product.images.edges.length ? <img src={variantImage} alt={`${product.title} product shot`} /> : null}
      <h5 className='Product__title'>{product.title}</h5>
      <span className='Product__price'>${variant.price}</span>
      <label className='Product__option'>
        數量
        <input min='1' type='number' defaultValue={variantQuantity} onChange={handleQuantityChange} />
      </label>
      <button className='Product__buy button' onClick={() => addVariantToCart(variant.id, variantQuantity)}>Add to Cart</button>
    </div>
  )
}
