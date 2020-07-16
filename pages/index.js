import { useContext } from 'react'
import { applySession } from 'next-session'

import withApollo from '../hooks/withApollo'

import AppContext from '../components/AppContext'
import Product from '../components/Product'
import Header from '../components/Header'
import Cart from '../components/Cart'
import { withUserContext } from '../components/UserContext'

function Home ({ user }) {
  const { productsData, productsLoading } = useContext(AppContext)

  if (productsLoading || !productsData) {
    return <h1>loading...</h1>
  }

  return (
    <div>
      <Header user={user} />
      <Cart />
      <div className='page-container container'>
        <main>
          <div className='Product-wrapper'>
            {productsData.shop.products.edges.map(product =>
              <Product key={product.node.id.toString()} product={product.node} />
            )}
          </div>
        </main>
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

export default withApollo(withUserContext(Home))
