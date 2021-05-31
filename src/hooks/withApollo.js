import withApollo from 'next-with-apollo'
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      uri: `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_NAME}.myshopify.com/api/2020-10/graphql.json`,
      fetchOptions: {
        mode: 'cors'
      },
      cache: new InMemoryCache().restore(initialState || {}),
      request: operation => {
        operation.setContext({
          headers: {
            'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_TOKEN
          }
        })
      }
    })
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      )
    }
  }
)
