export default () => {
  return (
    <div className='page-container'>
      <h1 className='text-center'>結帳</h1>

      <div className='container-fluid px-3'>
        <form>
          <div className='form-group'>
            <label for=''>請填寫貨運資訊</label>

            <div className='col-4 mx-0 my-2 px-0'>
              <input type='text' name='postcode' id='postcode' className='form-control d-block' placeholder='郵遞區號' />
            </div>

            <div className='col-6 row mx-0 my-2 px-0'>
              <div className='col-6 mx-0 px-0'>
                <input type='text' name='city' id='city' className='form-control w-30 mr-3 d-inline-block' placeholder='縣市' />
              </div>
              <div className='col-6 mx-0 px-0'>
                <input type='text' name='county' id='county' className='form-control w-30 ml-3 d-inline-block' placeholder='鄉鎮' />
              </div>
            </div>

            <input type='text' name='address' id='address' className='form-control d-block w-100' placeholder='地址' />
          </div>

          <div className='form-group'>
            <label>請填寫收件人資訊</label>

            <div className='col-4 mx-0 my-2 px-0'>
              <input type='text' name='recipient' id='recipient' className='form-control d-block' placeholder='收件人' />
            </div>

            <div className='col-6 mx-0 px-0'>
              <input type='text' name='recipientContact' id='recipientContact' className='form-control' placeholder='收件人聯絡方式' />
            </div>
          </div>

          <div className='form-group'>
            <label>請選擇付款方式</label>

            <button disabled className='btn btn-secondary mt-3'>ATM</button>
          </div>
        </form>

        <div className='text-right'>
          <button className='btn btn-danger mr-3'>清空</button>
          <button className='btn'>前往付款</button>
        </div>
      </div>
    </div>
  )
}
