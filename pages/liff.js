import Link from 'next/link'
import React from 'react'

const LIFF = () => {
  return (
    <div className='w-100 h-100 d-flex justify-content-center align-items-center'>
      <Link href='/liff/applyInvitation'>
        <div className='touch-box w-100 h-100 d-flex justify-content-center align-items-center'>
          <a className='text-decoration-none'>
            輸入邀請碼
          </a>
        </div>
      </Link>
      <Link href='/liff/myInvitation'>
        <div className='touch-box w-100 h-100 d-flex justify-content-center align-items-center'>
          <a className='text-decoration-none'>
            取得邀請碼
          </a>
        </div>
      </Link>
      <style jsx>{`
        .touch-box {
          border: solid 1px #333;
          font-size: 2rem;
          color: black;
        }
      `}
      </style>
    </div>
  )
}
export default LIFF
