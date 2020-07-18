import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

client.connect()

export async function getMongoClient () {
  if (!client.isConnected()) await client.connect()

  return client
}
