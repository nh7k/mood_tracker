import { MongoClient } from "mongodb"

let cachedClient: MongoClient | null = null

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient.db("mindwell")
  }

  const client = new MongoClient(process.env.MONGODB_URI!)
  await client.connect()
  cachedClient = client
  return client.db("mindwell")
}
