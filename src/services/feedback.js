import prisma from '../utils/prisma'

/**
 * @param {string} lineUserId
 * @param {Date} submittedAt
 */
export async function upsertFeedbackSubmission (lineUserId, submittedAt) {
  const data = {
    lineUserId,
    submittedAt
  }

  if ((await prisma.feedbackSubmission.findMany({
    where: data
  })).length === 0) {
    await prisma.feedbackSubmission.create({
      data
    })
  }
}

/**
 *
 * @param {string} lineUserId
 * @param {Date} submittedAt
 */
export async function hasPreviousSubmissionInThisMonth (lineUserId, submittedAt) {
  const monthStart = new Date(submittedAt.getTime())
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0)
  monthStart.setUTCMinutes(0)
  monthStart.setUTCMinutes(0)

  const submissions = await prisma.feedbackSubmission.findMany({
    where: {
      lineUserId,
      submittedAt: {
        lt: submittedAt,
        gt: monthStart
      }
    }
  })

  return submissions && submissions.length > 0
}
