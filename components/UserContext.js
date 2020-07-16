import { createContext, useState, useEffect } from 'react'

const UserContext = createContext()

export default UserContext

export const withUserContext = Components => (props) => {
  const [liffLoaded, setLiffLoaded] = useState(false)
  /** @type [import('@line/liff').default] */
  const [liffClient, setLiffClient] = useState(null)
  const [liffState, setLiffState] = useState(null)
  const [liffProfile, setLiffProfile] = useState(null)

  const initializeLiffClient = async (liff) => {
    await liff.init({
      liffId: process.env.NEXT_PUBLIC_LIFF_ID
    })

    let profile
    if (liff.isLoggedIn()) {
      profile = await liff.getProfile()
    } else {
      liff.login({
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

          setLiffProfile(profile)

          setLiffState({
            customer, // TODO: move this out
            isInClient: liff.isInClient(),
            isLoggedIn: liff.isLoggedIn()
          })
          setLiffLoaded(true)
        }
      })
  }

  useEffect(() => {
    import('@line/liff').then(liff => {
      setLiffClient(liff)
      initializeLiffClient(liff)
    })
  }, [])

  return (
    <UserContext.Provider value={{
      liffLoaded,
      liff: liffClient,
      liffState,
      profile: liffProfile
    }}
    >
      <Components {...props} />
    </UserContext.Provider>
  )
}

/*
export async function getServerSideProps ({ req, res }) {
  await applySession(req, res)

  console.log(`session = ${JSON.stringify(req.session)}`)

  return {
    props: {
      customer: req.session.customer
    }
  }
}
*/
