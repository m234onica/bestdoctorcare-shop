import { applySession } from 'next-session'

import { Invitation, InvitationCode } from '../../utils/models'
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

  const codeRecord = await InvitationCode.findOne({
    code
  })
  if (!codeRecord) {
    return res.send({
      error: 'Invitation code not found'
    })
  }

  const invitedUserId = req.session.user.legacyResourceId

  let invitationRecord = await Invitation.findOne({
    userId: codeRecord.userId,
    invitedUserId
  })

  if (invitedUserId === codeRecord.userId) {
    return res.send({
      error: 'Cannot use invitation code of yourself'
    })
  }

  if (codeRecord && !invitationRecord && invitedUserId !== codeRecord.userId) {
    invitationRecord = await Invitation.create({
      userId: codeRecord.userId,
      invitedUserId
    })

    const discountCode = await createDiscountFromInvitation(invitationRecord)

    try {
      notifyInvitationComplete(codeRecord.userId, invitedUserId)
    } catch (err) {
      console.error(err)
    }

    return res.send({
      discountCode
    })
  } else {
    return res.send({
      error: 'invalid invitation code'
    })
  }
}
