import Head from 'next/head'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import withApollo from '../hooks/withApollo'

const query = gql`{
  shop {
    products(first: 5) {
      edges {
        node {
          id
          handle
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
}`

function Home () {
  const { loading, data } = useQuery(query)

  if (loading || !data) {
    return <h1>loading...</h1>
  }

  return (
    <div className='container'>
      <Head>
        <title>Bestdoctorcare line store</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        {JSON.stringify(data)}
      </main>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
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
