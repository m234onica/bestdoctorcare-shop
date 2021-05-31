import { useEffect, useState } from 'react'

export const isDuringLiffRedirect = () => {
  const params = new URLSearchParams(location.search)
  return !!params.get('liff.state')
}

/**
 * @callback useLiffClientCallback
 * @param {import('@line/liff').default} liff
 */

/**
 *
 * @param {useLiffClientCallback} cb
 */
export const useLiffClient = (cb) => {
  /** @type [import('@line/liff').default, any] */
  const [liffClient, setLiffClient] = useState(null)

  useEffect(() => {
    import('@line/liff').then(liff => {
      setLiffClient(liff)
      cb(liff)
    })
  }, [])

  return [liffClient]
}

export const getLiffInfo = () => {
  let liffId, redirectUri
  if (window.location.pathname === '/liff') {
    liffId = process.env.NEXT_PUBLIC_INVITATION_LIFF_ID
    redirectUri = process.env.NEXT_PUBLIC_INVITATION_LIFF_DOMAIN
  } else {
    liffId = process.env.NEXT_PUBLIC_LIFF_ID
    redirectUri = process.env.NEXT_PUBLIC_LIFF_DOMAIN + window.location.pathname
  }

  return {
    liffId, redirectUri
  }
}
