import Head from 'next/head'
import React, { useContext } from 'react'
import {
  QueryClient,
  QueryClientProvider
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import '../polo/scss/plugins/plugins.css'
import '../polo/scss/style.scss'

import Header from '../components/Header'
import Cart from '../components/Cart'
import FullPageSpinner from '../components/FullPageSpinner'

import { withCartContext } from '../components/CartContext'
import { withAppContext } from '../components/AppContext'
import UserContext, { withUserContext } from '../components/UserContext'

const queryClient = new QueryClient()

const _App = ({ Component, pageProps }) => {
  const { user, liffState } = useContext(UserContext)

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>Bestdoctorcare line store</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1' />
      </Head>

      {
        liffState.loaded ? <>
          <Header user={user} />
          <Cart />
          <Component {...pageProps} />
        </> : <>
          <FullPageSpinner />
        </>
      }
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
        height: 100%;
      }

      #__next {
        height: 100%;
      }

      .page-container {
        padding: 45px 15px 60px 15px;
      }

      * {
        box-sizing: border-box;
      }

      a {
        color: black;
      }

      a:not(.btn):not(.badge):hover, a:not(.btn):not(.badge):focus, a:not(.btn):not(.badge):active {
        color: #5E5E5E;
      }
    `}
      </style>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

const App = withAppContext(withCartContext(withUserContext(_App)))
export default App
