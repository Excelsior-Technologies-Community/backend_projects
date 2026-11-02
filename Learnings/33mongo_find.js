const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydb";

async function findAll() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("MongoDB Connected!!");

    const db = client.db(dbName);

    const result = await db.collection("customers").find({}).toArray();
    console.log(result);
  } catch (err) {
    console.error("Error", err.message);
  } finally {
    await client.close();
  }
}
findAll();
