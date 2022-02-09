import { MongoClient, Db } from "mongodb";

const url = `mongodb://${secrets.MONGO_USER}:${secrets.MONGO_PASSWORD}@wwts_db:27017/wwts`;

export var db: Db;

export const connectToDB = async () => {
  const client = new MongoClient(url, {});
  try {
    await client.connect();
    db = client.db("wwts");
    prepareDatabase();
    console.log("Connected to database!");
  } catch (e) {
    console.error(e);
  }
};

export const getCollection = <Type = any>(name: string) => {
  return db.collection<Type>(name);
};

async function prepareDatabase() {
  try {
    await getCollection("vote").createIndex({ token: 1, ballot: 1 }, { unique: true });
    await getCollection("token").createIndex({ token: 1 }, { unique: true });
    await getCollection("admin").createIndex({ username: 1 }, { unique: true });
  } catch (err) {
    console.log(err);
    return { message: "Error while saving User" };
  }
}
