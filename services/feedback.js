import { FeedbackSubmission } from '../utils/models'

/**
 * @param {string} lineUserId
 * @param {Date} submittedAt
 */
export async function upsertFeedbackSubmission (lineUserId, submittedAt) {
  const data = {
    lineUserId: lineUserId,
    submitted_at: submittedAt
  }
  await FeedbackSubmission.findOneAndUpdate(data, data, { upsert: true })
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

  const submissions = await FeedbackSubmission.find({
    lineUserId,
    submitted_at: {
      $lt: submittedAt,
      $gt: monthStart
    }
  })

  return submissions && submissions.length > 0
}
