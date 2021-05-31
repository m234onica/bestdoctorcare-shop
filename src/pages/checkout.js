/* eslint-env browser */
import React, { useRef, useContext, useState, useEffect } from 'react'
import { submitForm } from '../utils/browser'
import UserContext from '../components/UserContext'
import CartContext from '../components/CartContext'
import { useAvailableDiscounts } from '../src/api/discountQuery'

const Checkout = () => {
  const zip = useRef()
  const city = useRef()
  const province = useRef()
  const address1 = useRef()
  const name = useRef()
  const phone = useRef()

  const { liffState, user } = useContext(UserContext)
  const { items } = useContext(CartContext)

  const { usedDiscount, isSuccess } = useAvailableDiscounts(user)

  useEffect(() => {
    if (user?.defaultAddress) {
      const { defaultAddress } = user

      zip.current.value = defaultAddress.zip || ''
      city.current.value = defaultAddress.city || ''
      province.current.value = defaultAddress.province || ''
      address1.current.value = defaultAddress.address1 || ''
      name.current.value = defaultAddress.name || ''
      phone.current.value = defaultAddress.phone || ''
    }
  }, [user?.defaultAddress])

  const [submitting, setSubmitting] = useState(false)
  const checkoutFormValid = !submitting && isSuccess

  const checkout = (e) => {
    if (submitting) {
      return
    }

    e.preventDefault()
    setSubmitting(true)

    if (!liffState.profile?.userId || items.length === 0) {
      setSubmitting(false)
      return
    }

    const shippingAddress = {
      zip: zip.current.value,
      address1: address1.current.value,
      city: city.current.value,
      firstName: name.current.value,
      province: province.current.value,
      phone: phone.current.value,
      country: 'Taiwan'
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
        lineItems: items.map(({ variantId, quantity }) => ({ variantId, quantity })),
        shippingAddress,
        discountCode: usedDiscount && usedDiscount.code
        // note
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(r => r.json())
      .then(data => {
        submitForm(data)
      })
      .finally(() => {
        setSubmitting(false)
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
            <label>請填寫貨運資訊</label>

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

          {
            usedDiscount && (
              <div className='form-group'>
                <label>使用折扣碼</label>

                <div className='col-6 mx-0 px-0'>
                  <input type='text' name='discount' className='form-control w-30 mr-3 d-inline-block' placeholder='折扣碼' readOnly value={`${usedDiscount.code} (${usedDiscount.title})`} disabled />
                </div>
              </div>
            )
          }

          <div className='text-right'>
            <button className='btn btn-danger mr-3' onClick={clear}>清空</button>
            <button className='btn' type='submit' onClick={checkout} disabled={!checkoutFormValid}>前往付款</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Checkout
