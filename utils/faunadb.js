import faunadb from 'faunadb'

const { FAUNADB_SECRET: secret } = process.env

/** @type {faunadb.Client} */
let client

if (secret) {
  client = new faunadb.Client({ secret })
}

export default client
