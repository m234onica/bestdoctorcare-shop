export default (req, res) => {
  console.log(req.body)

  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('1|OK')
  return res.end()
}
