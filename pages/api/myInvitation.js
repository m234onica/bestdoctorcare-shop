import { initConnection, InvitationCode } from '../../utils/models'
import { applySession } from 'next-session'

/**
 * @param {import('next/types').NextApiRequest} req
 * @param {import('next/types').NextApiResponse} res
 */
export default async (req, res) => {
  await applySession(req, res)

  if (!req.session.user) {
    return res.send({
      error: 'User not logined'
    })
  }

  await initConnection()

  const codeRecord = await InvitationCode.findOne({
    userId: req.session.user.legacyResourceId
  })

  if (codeRecord) {
    return res.json({
      code: codeRecord.code
    })
  } else {
    return res.json({
      error: 'Code record not found'
    })
  }
}