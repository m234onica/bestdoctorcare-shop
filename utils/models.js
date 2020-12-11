import mongoose, { model, Schema } from 'mongoose'

let db

export async function initConnection () {
  return new Promise((resolve, reject) => {
    if (db) {
      return
    }

    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).catch(err => {
      console.error(err)
    })

    db = mongoose.connection

    db.on('error', function (err) {
      console.error(err)
      db = null
      reject(err)
    })
    db.once('open', function () {
      resolve(db)
    })
  })
}

/** @type {mongoose.Model} */
let InvitationCode
try {
  InvitationCode = model('InvitationCode')
} catch (err) {
  InvitationCode = model('InvitationCode', new Schema({
    userId: String,
    code: String
  }))
}

/** @type {mongoose.Model} */
let Invitation
try {
  Invitation = model('Invitation')
} catch (err) {
  Invitation = model('Invitation', new Schema({
    userId: String,
    invitedUserId: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }))
}

/** @type {mongoose.Model} */
let DraftOrderRelation
try {
  DraftOrderRelation = model('DraftOrderRelation')
} catch (err) {
  DraftOrderRelation = model('DraftOrderRelation', new Schema({
    orderId: String,
    draftOrderId: String
  }))
}

/** @type {mongoose.Model} */
let FeedbackSubmission
try {
  FeedbackSubmission = model('FeedbackSubmission')
} catch (err) {
  FeedbackSubmission = model('FeedbackSubmission', new Schema({
    lineUserId: String,
    submitted_at: Date
  }))
}

export {
  InvitationCode,
  Invitation,
  DraftOrderRelation,
  FeedbackSubmission
}
