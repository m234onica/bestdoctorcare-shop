import React, { createContext, useState } from 'react'
import { isDuringLiffRedirect, useLiffClient, getLiffInfo } from '../utils/liff'

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
  const [liffState, setLiffState] = useState({
    loaded: false,
    isInClient: false,
    isLoggedIn: false,
    profile: null
  })
  const [user, setUser] = useState(null)

  // init liff client
  const [liffClient] = useLiffClient(async liff => {
    const { liffId, redirectUri } = getLiffInfo()

    liff.ready.then(async () => {
      await initializeLiffClient(liff, redirectUri)
      doLogin(liff)
    })

    liff.init({
      liffId
    })
  })

  /**
   * @param {import('@line/liff').default} liff
   */
  const initializeLiffClient = async (liff, redirectUri) => {
    if (isDuringLiffRedirect()) {
      return
    }

    if (!liff.isLoggedIn()) {
      // TODO: handle dynamic path redirection
      await liff.login({
        redirectUri
      })
    }

    setLiffState({
      ...liffState,
      loaded: true
    })
  }

  /**
   *
   * @param {import('@line/liff').default} liff
   */
  const doLogin = async (liff) => {
    const data = await window.fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        accessToken: liff.getAccessToken()
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())

    if (data.status === 'ok') {
      const { data: { user, profile } } = data
      setUser(user)

      setLiffState({
        isInClient: liff.isInClient(),
        isLoggedIn: liff.isLoggedIn(),
        loaded: true,
        profile
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
