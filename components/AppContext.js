import { createContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import withApollo from '../hooks/withApollo'

const AppContext = createContext()

export default AppContext

const query = gql`
  query query {
    shop {
      name
      description
      products(first:200) {
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

export const withAppContext = Components => withApollo((props) => {
  const { loading, data } = useQuery(query)

  // TODO: build product variant lookup releationship manually

  return (
    <AppContext.Provider value={{
      productsData: data,
      productsLoading: loading
    }}
    >
      <Components {...props} />
    </AppContext.Provider>
  )
})
