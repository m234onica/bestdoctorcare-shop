import React, { createContext, useEffect, useState } from 'react'
import { isDuringLiffRedirect, useLiffClient } from '../utils/liff'

/**
 * @typedef LiffState
 * @property {boolean} loaded
 * @property {boolean} isInClient
 * @property {boolean} isLoggedIn
 * @property {any} profile
 */

/**
 * @typedef TUserContext
 * @property {import('@line/liff').default} liff
 * @property {any} user
 * @property {LiffState} liffState
 */

/** @type {import('react').Context<TUserContext>} */
export const UserContext = createContext({
  liff: null,
  user: null,
  liffState: null
})

export default UserContext

export const withUserContext = Components => (props) => {
  const [lineProfile, setLineProfile] = useState(null)
  const [liffState, setLiffState] = useState({
    loaded: false,
    isInClient: false,
    isLoggedIn: false,
    profile: null
  })
  const [user, setUser] = useState(null)

  // init liff client
  const [liffClient] = useLiffClient(async liff => {
    await initializeLiffClient(liff)
  })

  useEffect(() => {
    if (!user && lineProfile && liffClient) {
      doLogin(liffClient)
    }
  }, [
    lineProfile,
    liffClient,
    user
  ])

  /**
   * @param {import('@line/liff').default} liff
   */
  const initializeLiffClient = async (liff) => {
    let liffId, redirectUri
    if (window.location.pathname === '/liff') {
      liffId = process.env.NEXT_PUBLIC_INVITATION_LIFF_ID
      redirectUri = process.env.NEXT_PUBLIC_INVITATION_LIFF_DOMAIN
    } else {
      liffId = process.env.NEXT_PUBLIC_LIFF_ID
      redirectUri = process.env.NEXT_PUBLIC_LIFF_DOMAIN + window.location.pathname
    }

    if (liff.isInClient()) {
      liff.init({
        liffId
      })
    } else {
      console.log(`typeof liff.init = ${typeof liff.init}`)
      await liff.init({
        liffId
      })
    }

    if (isDuringLiffRedirect()) {
      return
    }

    setLiffState({
      ...liffState,
      loaded: true
    })

    if (liff.isLoggedIn()) {
      setLineProfile(await liff.getProfile())
    } else {
      // TODO: handle dynamic path redirection
      return await liff.login({
        redirectUri
      })
    }
  }

  const doLogin = async (liff) => {
    const data = await window.fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        profile: lineProfile
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())

    if (data.status === 'ok') {
      const { data: { user } } = data

      setUser(user)

      setLiffState({
        isInClient: liff.isInClient(),
        isLoggedIn: liff.isLoggedIn(),
        loaded: true,
        profile: lineProfile
      })
    }
  }

  return (
    <UserContext.Provider value={{
      liff: liffClient,
      user,
      liffState
    }}
    >
      <Components {...props} />
    </UserContext.Provider>
  )
}
