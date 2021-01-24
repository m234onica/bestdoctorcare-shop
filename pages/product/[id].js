import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Carousel } from 'react-bootstrap'

import withApollo from '../../hooks/withApollo'
import AppContext, { collectionProductIterator } from '../../components/AppContext'
import CartContext from '../../components/CartContext'

function getProductFromCollections (collections, productId) {
  const products = collectionProductIterator(collections)
  for (const product of products) {
    if (product.id === productId) {
      return product
    }
  }
  return null
}

function Product () {
  const { query, push } = useRouter()
  const { collections, collectionsLoading } = useContext(AppContext)
  const { addVariantToCart, items } = useContext(CartContext)

  if (collectionsLoading || !collections) {
    return <h1>loading...</h1>
  }

  const product = getProductFromCollections(collections, query.id)
  if (!product) {
    push('/404')
  }

  const variants = product.variants.edges.map(e => e.node)
  const variant = variants[0]
  const [variantId] = useState(variant.id)
  const [quantity, setQuantity] = useState(1)

  const increment = () => {
    setQuantity(quantity + 1)
  }

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const canAddToCart = quantity <= variant.quantityAvailable && variant.availableForSale
  const onChangeQuantity = (e) => {
    const value = parseInt(e.target.value, 10)
    if (isNaN(value)) {
      setQuantity(1)
    } else {
      setQuantity(value)
    }
  }

  // TODO: support more variants

  const variantPrice = variants.find(v => v.id === variantId).priceV2.amount

  return (
    <div className='page-container container'>
      <div className='product'>
        <Carousel>
          {
            product.images.edges.map(e => e.node).map(image => (
              <Carousel.Item key={image.transformedSrc}>
                <img
                  className='d-block w-100'
                  src={image.transformedSrc}
                />
              </Carousel.Item>))
          }
        </Carousel>

        <div className='product-description'>
          <div className='product-title'>
            <h3>{product.title}</h3>
          </div>
          <div className='product-price'>
            <ins>NT$ {variantPrice}</ins>
          </div>
          <div className='seperator m-b-10' />
          <p dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} style={{ overflowWrap: 'break-word' }} />

          <h6>選擇數量</h6>
          <div className='cart-product-quantity'>
            <div className='quantity m-l-5'>
              <input type='button' className='minus mr-1' value='-' onClick={decrement} />
              <input type='text' className='qty mw-100' value={quantity} pattern='\d*' onChange={onChangeQuantity} />
              <input type='button' className='plus ml-1' value='+' onClick={increment} />
            </div>
          </div>

          <div className='m-t-20'>
            <button className='btn btn-lg' type='button' onClick={() => {
              if (canAddToCart) {
                addVariantToCart(variant, quantity)
              }}} disabled={!canAddToCart}>
              <i className='icon-shopping-cart mr-2' />
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withApollo(Product)
