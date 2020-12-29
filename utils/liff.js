export const isDuringLiffRedirect = () => {
  const params = new URLSearchParams(location.search)
  return !!params.get('liff.state')
}
