
export function initEruda () {
  // if (!/eruda=true/.test(window.location.toString()) && window.localStorage.getItem('active-eruda') !== 'true') {
  //   return
  // }

  const eruda = require('eruda')
  eruda.init()
}
