import { useContext } from 'react'

import withApollo from '../hooks/withApollo'
import AppContext from '../components/AppContext'
import Product from '../components/Product'

function Home () {
  const { productsData, productsLoading } = useContext(AppContext)

  if (productsLoading || !productsData) {
    return <h1>loading...</h1>
  }

  return (
    <div className='page-container container'>
      <main>
        <div className='Product-wrapper'>
          {productsData.shop.products.edges.map(product =>
            <Product key={product.node.id.toString()} product={product.node} />
          )}
        </div>
      </main>
    </div>
  )
}

export default withApollo(Home)
