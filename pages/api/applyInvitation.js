import { applySession } from 'next-session'

import primsa from '../../utils/prisma'
import { notifyInvitationComplete, createDiscountFromInvitation } from '../../services/discount'

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

  const { code } = req.body

  if (!code) {
    return res.send({
      error: 'Invitation code not given'
    })
  }

  const codeRecord = await primsa.invitationCode.findFirst({
    where: {
      code
    }
  })
  if (!codeRecord) {
    return res.send({
      error: 'Invitation code not found'
    })
  }

  const invitedUserId = req.session.user.legacyResourceId


  const existingInvitationRecord = await primsa.invitation.findFirst({
    where: {
      invitedUserId
    }
  })
  if (existingInvitationRecord) {
    return res.send({
      error: 'Invitation code applied already'
    })
  }

  let invitationRecord = await primsa.invitation.findFirst({
    where: {
      userId: codeRecord.userId,
      invitedUserId
    }
  })

  if (invitedUserId === codeRecord.userId) {
    return res.send({
      error: 'Cannot use invitation code of yourself'
    })
  }

  if (codeRecord && !invitationRecord && invitedUserId !== codeRecord.userId) {

    invitationRecord = await primsa.invitation.create({
      data: {
        userId: codeRecord.userId,
        invitedUserId
      }
    })

    await createDiscountFromInvitation(invitationRecord)

    try {
      notifyInvitationComplete(codeRecord.userId, invitedUserId)
    } catch (err) {
      console.error(err)
    }

    res.statusCode = 200
    return res.end()
  } else {
    return res.send({
      error: 'invalid invitation code'
    })
  }
}
