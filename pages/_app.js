import Head from 'next/head'
import '../polo/scss/plugins/plugins.css'
import '../polo/scss/style.scss'

import { withCartContext } from '../components/CartContext'
import { withAppContext } from '../components/AppContext'

const App = ({ Component, pageProps }) => (
  <div>
    <Head>
      <title>Bestdoctorcare line store</title>
      <link rel='icon' href='/favicon.ico' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    </Head>
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
      }

      .page-container {
        padding-top: 60px;
      }

      * {
        box-sizing: border-box;
      }
    `}
    </style>
  </div>
)

export default withAppContext(withCartContext(App))
