import { createContext, useMemo } from 'react'
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
      availableForSale
      quantityAvailable
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
  const variants = variantProductIterator(collections)
  const variantsMap = useMemo(() =>
    Array.from(variants).reduce((acc, v) => ({ ...acc, [v.id]: v }), {})
  , [collections])

  // TODO: build product variant lookup releationship manually

  return (
    <AppContext.Provider value={{
      collections,
      collectionsLoading: loading,
      variantsMap
    }}
    >
      <Components {...props} />
    </AppContext.Provider>
  )
})

export function * collectionProductIterator (collections = { edges: [] }) {
  for (const collection of collections.edges) {
    for (const e of collection.node.products.edges) {
      yield e.node
    }
  }
}

export function * variantProductIterator (collections = { edges: [] }) {
  const products = collectionProductIterator(collections)

  for (const product of products) {
    for (const e of product.variants.edges) {
      const variant = e.node
      variant.product = product
      yield variant
    }
  }
}
