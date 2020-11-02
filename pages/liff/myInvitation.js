/* eslint-env browser */
import { useState, useEffect } from 'react'
import { useCopyToClipboard } from 'react-use'

const MyInvitation = () => {
  const [code, setCode] = useState(null)

  useEffect(() => {
    fetch('/api/myInvitation').then(res => res.json()).then(data => {
      if (data.code) {
        setCode(data.code)
      }
    })
  }, [])
  const [, copyToClipboard] = useCopyToClipboard()

  return (
    <div className='d-flex flex-column justify-content-center align-items-center h-100 w-100 mx-auto px-4' style={{ minWidth: 250, maxWidth: 350 }}>
      <div className='w-100 text-left'>
        <h3>您的邀請碼：</h3>
      </div>
      <div className='text-center mt-4 mb-4' style={{ fontSize: '2.2rem' }}>{code}</div>
      <div className='text-right w-100'>
        <button className='btn btn-secondary' onClick={() => copyToClipboard(code)}>複製邀請碼</button>
      </div>
    </div>
  )
}

export default MyInvitation
