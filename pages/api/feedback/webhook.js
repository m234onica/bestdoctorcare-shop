import bodyParser from 'body-parser'

import { verifySignature } from '../../../utils/typeform'
import { runMiddleware } from '../../../utils/middleware'
import { client } from '../../../utils/line'
import { hasPreviousSubmissionInThisMonth, upsertFeedbackSubmission } from '../../../services/feedback'
import { createDiscountFromLineUserId } from '../../../services/discount'

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

  // Verify typeform payload
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

  const submittedAt = new Date(rawSubmittedAt)

  await upsertFeedbackSubmission(lineUserId, submittedAt)
  const hasSubmission = await hasPreviousSubmissionInThisMonth(lineUserId, submittedAt)

  if (!hasSubmission) {
    try {
      await createDiscountFromLineUserId(lineUserId)

      await client.pushMessage(lineUserId, [{
        type: 'text',
        text: '恭喜完成本月任務，您已獲得折價券一張。'
      }])
    } catch (e) {
      if (e?.originalError?.isAxiosError) {
        /** @type {import('axios').AxiosError} */
        const err = e.originalError
        console.error(err.toJSON())
        console.error(err.response.data)
      } else {
        console.error(e)
      }
    }
  }

  res.statusCode = 200
  return res.end()
}

export default handler
