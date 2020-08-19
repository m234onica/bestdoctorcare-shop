import { lineMiddleware, client } from '../../utils/line'

export const config = {
  api: {
    bodyParser: false
  }
}

function runMiddleware (req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

function handleEvent (event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null)
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text }

  // use reply API
  return client.replyMessage(event.replyToken, echo)
}

/**
 * @param {import('next/types').NextApiRequest} req
 * @param {import('next/types').NextApiResponse} res
 */
async function handler (req, res) {
  await runMiddleware(req, res, lineMiddleware)

  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => console.log(result))
    .catch((err) => {
      console.error(err)
      res.status(500).end()
    })
}

export default handler