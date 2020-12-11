const crypto = require('crypto')

export function verifySignature (signature, payload) {
  const hash = crypto.createHmac('sha256', process.env.TYPEFORM_SECRET)
    .update(payload)
    .digest('base64')

  const actualSig = `sha256=${hash}`

  return signature === actualSig
}
