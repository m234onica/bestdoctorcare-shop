import Head from 'next/head'
import { useContext } from 'react'
import '../polo/scss/plugins/plugins.css'
import '../polo/scss/style.scss'

import Header from '../components/Header'
import Cart from '../components/Cart'

import { withCartContext } from '../components/CartContext'
import { withAppContext } from '../components/AppContext'
import UserContext, { withUserContext } from '../components/UserContext'

const App = ({ Component, pageProps }) => {
  const { user } = useContext(UserContext)

  return (
    <div>
      <Head>
        <title>Bestdoctorcare line store</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <Header user={user} />
      <Cart />
      <Component {...pageProps} />
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

      #__next > div {
        height: 100%;
      }

      .page-container {
        padding-top: 45px;
        padding-bottom: 60px;
      }

      * {
        box-sizing: border-box;
      }
    `}
      </style>
    </div>
  )
}

export default withAppContext(withCartContext(withUserContext(App)))
