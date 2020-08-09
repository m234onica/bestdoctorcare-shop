/* eslint-env browser */
import { useRef, useContext } from 'react'
import { submitForm } from '../utils/browser'
import UserContext from '../components/UserContext'
import CartContext from '../components/CartContext'

export default () => {
  const zip = useRef()
  const city = useRef()
  const province = useRef()
  const address1 = useRef()
  const name = useRef()
  const phone = useRef()

  const { liffState } = useContext(UserContext)
  const { items } = useContext(CartContext)

  const checkout = (e) => {
    e.preventDefault()

    if (!liffState.profile?.userId || items.length === 0) {
      return
    }

    const shippingAddress = {
      zip: zip.current.value,
      address1: address1.current.value,
      city: city.current.value,
      name: name.current.value,
      province: province.current.value,
      phone: phone.current.value
    }

    /*
    const note = Object.entries({
      shippingTime: '中午前、中午後',
      shippingType: '收貨方式??',
      note: '備註'
    }).map(([key, value]) => `${key}: ${value}`).join('\n')
    */

    fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        userId: liffState.profile.userId,
        lineItems: items.map(({ variantId, quantity }) => ({ variantId, quantity })),
        shippingAddress
        // note
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(r => r.json())
      .then(data => {
        submitForm(data)
      })
  }

  const clear = () => {
    zip.current.value = ''
    address1.current.value = ''
    city.current.value = ''
    name.current.value = ''
    province.current.value = ''
    phone.current.value = ''
  }

  return (
    <div className='page-container'>
      <h1 className='text-center'>結帳</h1>

      <div className='container-fluid px-3'>
        <form>
          <div className='form-group'>
            <label for=''>請填寫貨運資訊</label>

            <div className='col-4 mx-0 my-2 px-0'>
              <input type='text' name='zip' id='zip' className='form-control d-block' placeholder='郵遞區號' required ref={zip} />
            </div>

            <div className='col-6 row mx-0 my-2 px-0'>
              <div className='col-6 mx-0 px-0'>
                <input type='text' name='city' id='city' className='form-control w-30 mr-3 d-inline-block' placeholder='縣市' required ref={city} />
              </div>
              <div className='col-6 mx-0 px-0'>
                <input type='text' name='province' id='province' className='form-control w-30 ml-3 d-inline-block' placeholder='鄉鎮' ref={province} />
              </div>
            </div>

            <input type='text' name='address1' id='address1' className='form-control d-block w-100' placeholder='地址' required ref={address1} />
          </div>

          <div className='form-group'>
            <label>請填寫收件人資訊</label>

            <div className='col-4 mx-0 my-2 px-0'>
              <input type='text' name='name' id='name' className='form-control d-block' placeholder='收件人' required ref={name} />
            </div>

            <div className='col-6 mx-0 px-0'>
              <input type='text' name='phone' id='phone' className='form-control' placeholder='收件人聯絡方式' required ref={phone} />
            </div>
          </div>

          <div className='form-group'>
            <label>請選擇付款方式</label>

            <button disabled className='btn btn-secondary mt-3'>ATM</button>
          </div>

          <div className='text-right'>
            <button className='btn btn-danger mr-3' onClick={clear}>清空</button>
            <button className='btn' type='submit' onClick={checkout}>前往付款</button>
          </div>
        </form>
      </div>
    </div>
  )
}
