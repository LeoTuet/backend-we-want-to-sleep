import { Db, MongoClient } from "mongodb";
import { secrets } from "../utils/secrets";

const DB_URL = `mongodb://${secrets.MONGO_USER}:${secrets.MONGO_PASSWORD}@${secrets.MONGO_HOST}`;
const DB_NAME = "wwts";

export var db: Db;

export const connectToDB = async () => {
  const client = new MongoClient(DB_URL, {});

  await client.connect();
  db = client.db(DB_NAME);
  await prepareDatabase();

  console.log("Connected to database!");
};

export const getCollection = <Type = any>(name: string) => {
  return db.collection<Type>(name);
};

async function prepareDatabase() {
  await getCollection("vote").createIndex(
    { token: 1, ballot: 1 },
    { unique: true }
  );
  await getCollection("token").createIndex({ token: 1 }, { unique: true });
  await getCollection("admin").createIndex({ username: 1 }, { unique: true });
}
