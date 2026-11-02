const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydb";

async function findOne() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("MongoDB Connected!!");

    const db = client.db(dbName);

    const result = await db.collection("customers").findOne({});
    console.log(result.name + "\n" + result.address);
  } catch (err) {
    console.error("Error", err.message);
  } finally {
    await client.close();
  }
}
findOne();
