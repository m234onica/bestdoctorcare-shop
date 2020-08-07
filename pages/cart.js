import { useContext, useMemo } from 'react'
import { useRouter } from 'next/router'

import CartContext from '../components/CartContext'
import AppContext from '../components/AppContext'


export default () => {
  const { items, addVariantToCart, removeVariantFromCart, totalPrice } = useContext(CartContext)
  const { collections, variantsMap } = useContext(AppContext)
  const router = useRouter()

  const cartItems = useMemo(() => {
    return items.sort(i => i.variantId).map(({
      variant,
      variantId,
      quantity
    }) => ({
      id: variantId,
      name: variantsMap[variantId].product.title,
      quantity,
      price: variant.priceV2.amount,
      subtatal: parseFloat(variant.priceV2.amount) * quantity
    }))
  }, [items, collections])

  return (
    <div className='page-container'>
      <h1 className='text-center'>購物車</h1>

      <div className='container-fluid px-3'>
        <table className='table table-striped'>
          <thead className='thead'>
            <tr>
              <th>商品名稱</th>
              <th>數量</th>
              <th>單價</th>
              <th>小計</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td className='cart-product-quantity'>
                  <div className='quantity'>
                    <input type='number' name='quantity' min='1' step='1' defaultValue={item.quantity} onChange={(e) => addVariantToCart(variantsMap[item.id], parseInt(e.target.value, 10))} />
                  </div>
                </td>
                <td>{item.price}</td>
                <td>{item.subtatal}</td>
                <td><a onClick={() => removeVariantFromCart(item.id)}>移除</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {
        items.length > 0 ? (
          <div className='container'>
            <h4>結帳金額</h4>

            <table className='table'>
              <tbody>
                <tr>
                  <td className='cart-product-name'>
                    <strong>小計</strong>
                  </td>
                  <td className='cart-product-name text-right'>
                    <span className='amount'>NT$ {totalPrice}</span>
                  </td>
                </tr>
                <tr>
                  <td className='cart-product-name'>
                    <strong>運費</strong>
                  </td>
                  <td className='cart-product-name  text-right'>
                    <span className='amount'>NT$ XXX</span>
                  </td>
                </tr>
                <tr>
                  <td className='cart-product-name'>
                    <strong>折扣</strong>
                  </td>
                  <td className='cart-product-name  text-right'>
                    <span className='amount'>(NT$ -60)</span>
                  </td>
                </tr>
                <tr>
                  <td className='cart-product-name'>
                    <strong>總計</strong>
                  </td>
                  <td className='cart-product-name text-right'>
                    <span className='amount color lead'><strong>NT$ {totalPrice}</strong></span>
                  </td>
                </tr>
              </tbody>
            </table>
            <button className='btn btn-lg d-block mx-auto'>確定結帳</button>
          </div>
        ) : <button className='btn btn-lg btn-success d-block mx-auto' onClick={() => router.push('/')}>先來逛逛吧</button>
      }

    </div>
  )
}
