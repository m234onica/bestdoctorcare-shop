import App from 'next/app'
import Head from 'next/head'
import UserContext from '../components/UserContext'
import Header from '../components/Header'
import Cart from '../components/Cart'
import { withCartContext } from '../components/CartContext'
import { withAppContext } from '../components/AppContext'

class MyApp extends App {
  constructor () {
    super()

    this.state = {
      liffState: {
        loaded: false
      }
    }
  }

  componentDidMount () {
    import('@line/liff').then(liff => {
      /** @type import('@line/liff').default */
      this.liff = liff

      this.initializeLiffClient.bind(this)()
    })
  }

  async initializeLiffClient () {
    await this.liff.init({
      liffId: process.env.NEXT_PUBLIC_LIFF_ID
    })

    let profile
    if (this.liff.isLoggedIn()) {
      profile = await this.liff.getProfile()
    } else {
      this.liff.login({
        redirectUri: process.env.NEXT_PUBLIC_LIFF_DOMAIN // TODO: handle dynamic path redirection
      })
    }

    window.fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        profile
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          const { customer } = data.data
          this.setState({
            liffState: {
              profile,
              customer,
              loaded: true,
              isInClient: this.liff.isInClient(),
              isLoggedIn: this.liff.isLoggedIn()
            }
          })
        }
      })
  }

  render () {
    const { Component, pageProps } = this.props
    return (
      <UserContext.Provider value={{ liff: this.liff, liffState: this.state.liffState }}>
        <Head>
          <title>Bestdoctorcare line store</title>
          <link rel='icon' href='/favicon.ico' />
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        </Head>
        <Header profile={this.state.liffState.profile} />
        <Component {...pageProps} />
        <Cart />
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
      </UserContext.Provider>
    )
  }
}

export default withAppContext(withCartContext(MyApp))
