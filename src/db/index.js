const mongodb = require("mongodb")


async function makeDb() {

  const MongoClient = mongodb.MongoClient
  const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USER_PASSWORD}@sandbox.aznpb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  await client.connect()
  const db = await client.db(process.env.DB_NAME)

  return db
}

module.exports.makeDb = makeDb