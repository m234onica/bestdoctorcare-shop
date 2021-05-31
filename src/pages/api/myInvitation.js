import { applySession } from '../../utils/session'
import prisma from '../../utils/prisma'

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

  const codeRecord = await prisma.invitationCode.findFirst({
    where: {
      userId: req.session.user.legacyResourceId
    }
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
