import mongoose, { model, Schema } from 'mongoose'

(async function () {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }).catch(err => {
      console.error(err)
    })

    const db = mongoose.connection

    db.on('error', function (err) {
      console.error(err)
      reject(err)
    })
    db.once('open', function () {
      resolve(db)
    })
  })
})()

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
let Discount
try {
  Discount = model('Discount')
} catch (err) {
  Discount = model('Discount', new Schema({
    userId: String,
    description: String,
    code: String,
    value: String,
    type: String,
    usedAt: Date,
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
  FeedbackSubmission,
  Discount
}
