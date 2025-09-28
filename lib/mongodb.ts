// lib/mongodb.ts
import { MongoClient } from "mongodb";
var _mongoClientPromise: Promise<MongoClient> | undefined;
const uri = process.env.MONGODB_URI!;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!_mongoClientPromise) {
  const client = new MongoClient(uri);
  _mongoClientPromise = client.connect();
}
clientPromise = _mongoClientPromise;

export default clientPromise;
