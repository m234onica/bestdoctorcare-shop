import App from 'next/app'
import UserContext from '../components/UserContext'

class MyApp extends App {
  constructor () {
    super()

    this.state = {
      loaded: false
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
            profile,
            customer,
            loaded: true,
            isInClient: this.liff.isInClient(),
            isLoggedIn: this.liff.isLoggedIn()
          })
        }
      })
  }

  render () {
    const { Component, pageProps } = this.props
    return (
      <UserContext.Provider value={{ liff: this.liff, liffState: this.state }}>
        <Component {...pageProps} />
      </UserContext.Provider>
    )
  }
}

export default MyApp
