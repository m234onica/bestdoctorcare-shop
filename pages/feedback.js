import { applySession } from 'next-session'
import { useContext, useEffect } from 'react'

import UserContext from '../components/UserContext'

import { getLineUserIdFromCustomer } from '../utils/user'

const redirectFeedbackUrl = (user) => {
  const lineUserId = getLineUserIdFromCustomer(user)
  return process.env.NEXT_PUBLIC_FEEDBACK_FORM + `?line_user_id=${lineUserId}`
}

const Feedback = () => {
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (user) {
      window.location.assign(redirectFeedbackUrl(user))
    }
  }, [user])

  if (user) {
    return (
      <div className='page-container'>
        跳轉中...
      </div>
    )
  } else {
    return (
      <div className='page-container'>
        登入中...
      </div>
    )
  }
}

export default Feedback

/**
 * @param {import('next/types').NextPageContext} context
 */
export async function getServerSideProps ({ req, res }) {
  await applySession(req, res)

  if (req.session.user) {
    res.writeHead(302, {
      Location: redirectFeedbackUrl(req.session.user)
    })
    res.end()
  }

  return {
    props: {}
  }
}
