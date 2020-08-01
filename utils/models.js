import mongoose, { model, Schema } from 'mongoose'

export async function initConnection () {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
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
}

let InvitationCode
try {
  InvitationCode = model('InvitationCode')
} catch (err) {
  InvitationCode = model('InvitationCode', new Schema({
    userId: String,
    code: String
  }))
}

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

export {
  InvitationCode,
  Invitation
}
