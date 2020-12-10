import { createContext, useState, useEffect } from 'react'

const UserContext = createContext()

export default UserContext

export const withUserContext = Components => (props) => {
  /** @type [import('@line/liff').default] */
  const [liffClient, setLiffClient] = useState(null)
  const [liffState, setLiffState] = useState({
    loaded: false
  })

  const [user, setUser] = useState(null)

  const initializeLiffClient = async (liff) => {
    let liffId, redirectUri
    if (window.location.pathname === '/liff') {
      liffId = process.env.NEXT_PUBLIC_INVITATION_LIFF_ID
      redirectUri = process.env.NEXT_PUBLIC_INVITATION_LIFF_DOMAIN
    } else {
      liffId = process.env.NEXT_PUBLIC_LIFF_ID
      redirectUri = process.env.NEXT_PUBLIC_LIFF_DOMAIN + window.location.pathname
    }

    await liff.init({
      liffId
    })

    let profile
    if (liff.isLoggedIn()) {
      profile = await liff.getProfile()
    } else {
      // TODO: handle dynamic path redirection
      await liff.login({
        redirectUri
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
          const { data: { user } } = data

          setUser(user)

          setLiffState({
            isInClient: liff.isInClient(),
            isLoggedIn: liff.isLoggedIn(),
            loaded: true,
            profile
          })
        }
      })
  }

  useEffect(() => {
    import('@line/liff').then(liff => {
      setLiffClient(liff)
      initializeLiffClient(liff)
    })
  }, [])

  const getLineProfile = (user) => {
    const metafields = user && user.metafields?.edges
    if (!metafields) {
      return null
    }

    const metafield = metafields.find(m => m.node.key === 'line_profile')
    if (!metafield) {
      return null
    }

    return JSON.parse(metafield.node.value)
  }

  return (
    <UserContext.Provider value={{
      liff: liffClient,
      user,
      liffState,
      getLineProfile
    }}
    >
      <Components {...props} />
    </UserContext.Provider>
  )
}
