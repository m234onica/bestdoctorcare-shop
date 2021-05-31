
export function initEruda () {
  if (!/eruda=true/.test(window.location.toString()) && window.localStorage.getItem('active-eruda') !== 'true') {
    return
  }

  if (process.browser && process.env.NODE_ENV !== 'production') {
    const eruda = require('eruda')
    eruda.init()
  }
}
