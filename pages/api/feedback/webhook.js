import bodyParser from 'body-parser'

import { verifySignature } from '../../../utils/typeform'
import { runMiddleware } from '../../../utils/middleware'
import { FeedbackSubmission } from '../../../utils/models'
import { client } from '../../../utils/line'

// {
//   event_id: '01ES6JVT3MJTEG9NCGC60J0YGH',
//   event_type: 'form_response',
//   form_response: {
//     form_id: 'QNlqovpB',
//     token: '1376jaydiqczapflj5n1376jayp5w00o',
//     landed_at: '2020-12-10T14:57:28Z',
//     submitted_at: '2020-12-10T15:03:42Z',
//     hidden: { line_user_id: 'U4b1e176a9359872cd9ec6a2e4b01dc64' },
//     definition: { id: 'QNlqovpB', title: '百漢中醫診所 意見回饋', fields: [Array] },
//     answers: [ [Object], [Object], [Object] ]
//   }
// }

export const config = {
  api: {
    bodyParser: false
  }
}

const bodyParserMiddleware = bodyParser.raw({ type: 'application/json' })

/**
 * @param {import('next/types').NextApiRequest} req
 * @param {import('next/types').NextApiResponse} res
 */
async function handler (req, res) {
  await runMiddleware(req, res, bodyParserMiddleware)

  const respondError = (reason) => {
    console.error('feedback error' + (reason || ''))
    res.statusCode = 500
    return res.end()
  }

  const expectedSig = req.headers['typeform-signature']

  if (!verifySignature(expectedSig, req.body)) {
    return respondError('verifySignature failed')
  }

  const payload = JSON.parse(req.body)
  const lineUserId = payload.form_response?.hidden?.line_user_id
  const rawSubmittedAt = payload.form_response?.submitted_at

  if (!lineUserId || !rawSubmittedAt) {
    return respondError('Missing fields')
  }

  // TODO: record submit date

  const submittedAt = new Date(rawSubmittedAt)
  const data = {
    lineUserId: lineUserId,
    submitted_at: submittedAt
  }
  await FeedbackSubmission.findOneAndUpdate(data, data, { upsert: true })

  const monthStart = new Date(submittedAt.getTime())
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0)
  monthStart.setUTCMinutes(0)
  monthStart.setUTCMinutes(0)

  const submissions = await FeedbackSubmission.find({
    submitted_at: {
      $lt: submittedAt,
      $gt: monthStart
    }
  })

  if (submissions && submissions.length === 0) {
    try {
      await client.pushMessage(lineUserId, [{
        type: 'text',
        text: '恭喜完成任務'
      }])
    } catch (err) {
      console.error(err)
    }

    // TODO: Add coupon code
  }

  res.statusCode = 200
  return res.end()
}

export default handler
