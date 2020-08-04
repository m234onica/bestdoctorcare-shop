import { createContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import withApollo from '../hooks/withApollo'

const AppContext = createContext()

export default AppContext

const ProductFragment = `
id
title
options {
  id
  name
  values
}
descriptionHtml
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
        transformedSrc
      }
      priceV2 {
        amount
      }
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
      transformedSrc
    }
  }
}
`

const query = gql`
  query {
    collections(first: 20) {
      edges {
        node {
          id
          title
          image {
            transformedSrc
          }
          products(first: 200) {
            edges {
              node {
                ${ProductFragment}
              }
            }
          }
        }
      }
    }
  }
`

export const withAppContext = Components => withApollo((props) => {
  const { loading, data: { collections } = {} } = useQuery(query)

  // TODO: build product variant lookup releationship manually

  return (
    <AppContext.Provider value={{
      collections,
      collectionsLoading: loading
    }}
    >
      <Components {...props} />
    </AppContext.Provider>
  )
})
