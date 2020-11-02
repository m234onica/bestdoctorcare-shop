import { useState, useContext } from 'react'
import CartContext from './CartContext'

const Product = ({ product }) => {
  const variantImage = product.images.edges[0].node.src
  const variant = product.variants.edges[0].node
  const [variantQuantity, setVariantQuantity] = useState(1)
  const { addVariantToCart } = useContext(CartContext)

  const handleQuantityChange = (e) => {
    setVariantQuantity(parseInt(e.target.value, 10))
  }

  return (
    <div className='Product'>
      <div className='Product__image'>
        {product.images.edges.length ? <img src={variantImage} alt={`${product.title} product shot`} /> : null /* TODO: default placeholder image */}
      </div>
      <div className='Product__detail'>
        <h5 className='Product__title'>{product.title}</h5>
        <span className='Product__price'>${variant.price}</span>
        <label className='Product__option'>
          數量
          <input min='1' type='number' defaultValue={variantQuantity} onChange={handleQuantityChange} />
        </label>
        <button className='Product__buy button' onClick={() => addVariantToCart(variant, variantQuantity)}>Add to Cart</button>
      </div>

      <style jsx>{`
        .Product {
          max-width: 100%;
          border: solid 1px #eee;
          background-color: white;
          margin: 10px 15px;

          display: flex;
          height: 150px;
        }

        .Product__image {
          width: 150px;
          overflow: hidden;
        }

        .Product__image img {
          object-fit: cover;
          width: 150px;
          height: 150px;
        }

        .Product__detail {
          display: flex;
          flex-direction: column;
          padding: 10px 15px 10px 20px;
        }

        .Product__title {
          margin-block-start: .5em;
          margin-block-end: .5em;
        }
      `}
      </style>
    </div>
  )
}

export default Product
