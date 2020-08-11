const liffPages = [
  '/liff',
  '/liff/myInvitation',
  '/liff/applyInvitation'
]

export const isLiffPages = pathname => {
  return liffPages.includes(pathname)
}
