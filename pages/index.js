import Head from 'next/head'
import { useContext } from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

import withApollo from '../hooks/withApollo'
import UserContext from '../components/UserContext'
import Product from '../components/Product'

const query = gql`
  query query {
    shop {
      name
      description
      products(first:20) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
            title
            options {
              id
              name
              values
            }
            variants(first: 250) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    src
                  }
                  price
                }
              }
            }
            images(first: 250) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`

function Home () {
  const { loading, data } = useQuery(query)
  const { liffState } = useContext(UserContext)

  if (loading || !data) {
    return <h1>loading...</h1>
  }

  return (
    <div className='page-container container'>
      <Head>
        <title>Bestdoctorcare line store</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>

      <div className='Product-wrapper'>
        {data.shop.products.edges.map(product =>
          <Product key={product.node.id.toString()} product={product.node} />
        )}
      </div>

      <main>
        <code>
          {JSON.stringify(liffState)}
          {JSON.stringify(data)}
        </code>
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
