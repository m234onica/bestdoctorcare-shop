/* eslint-env browser */
import { useState, useContext } from 'react'
import UserContext from '../../components/UserContext'

export default () => {
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  /** @type import('@line/liff').default */
  const liff = useContext(UserContext).liff

  const onChange = (e) => {
    setCode(e.target.value)
  }

  const onSubmit = async () => {
    if (submitting) {
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const data = await fetch('/api/applyInvitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code
        })
      }).then(res => res.json())

      if (!data.error) {
        try {
          await liff.sendMessages([
            {
              type: 'text',
              text: `使用邀請碼 ${code} 成功`
            }
          ])
        } catch (err) {
          setError(String(err))
        }
        liff.closeWindow()
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError(String(err))
    }

    setSubmitting(false)
  }

  return (
    <div className='w-100 h-100 d-flex justify-content-center align-items-center flex-column'>
      {
        error && (
          <div className='alert alert-danger mb-3' role='alert'>
            <strong>{error}</strong>
          </div>
        )
      }
      <div className='form-group position-relative'>
        <input type='text' value={code} className='form-control pr-6' placeholder='邀請碼' onChange={onChange} />
        <button type='submit' onClick={onSubmit} disabled={submitting || !code} className='apply-invitation-btn btn btn-primary position-absolute' style={{ height: 40 }}>送出</button>
      </div>
      <style jsx>{`
        .apply-invitation-btn {
          top: 0;
          right: 0;
        }
      `}
      </style>
    </div>
  )
}
