import Head from 'next/head'
import { useContext } from 'react'

import withApollo from '../hooks/withApollo'
import UserContext from '../components/UserContext'
import AppContext from '../components/AppContext'
import Product from '../components/Product'

function Home () {
  const { productsData, productsLoading } = useContext(AppContext)

  if (productsLoading || !productsData) {
    return <h1>loading...</h1>
  }

  return (
    <div className='page-container container'>
      <Head>
        <title>Bestdoctorcare line store</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>

      <main>
        <div className='Product-wrapper'>
          {productsData.shop.products.edges.map(product =>
            <Product key={product.node.id.toString()} product={product.node} />
          )}
        </div>
      </main>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;

          overflow-x: hidden;
          overflow-y: auto;
          max-width: 100%;
        }

        .page-container {
          padding-top: 50px;
        }

        * {
          box-sizing: border-box;
        }
      `}
      </style>
    </div>
  )
}

export default withApollo(Home)
