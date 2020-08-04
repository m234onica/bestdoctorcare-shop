import React from 'react'
import { applySession } from 'next-session'

import withApollo from '../../hooks/withApollo'
import { withUserContext } from '../../components/UserContext'
import Header from '../../components/Header'
import Cart from '../../components/Cart'

function Product ({ user }) {
  return (
    <div>
      <Header user={user} />
      <Cart />
      <div className='page-container container'>
        <div>Products...</div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ req, res }) => {
  await applySession(req, res)

  return {
    props: {
      user: req.session.user || null
    }
  }
}

export default withApollo(withUserContext(Product))
