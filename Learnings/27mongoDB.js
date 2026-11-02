
const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("mydb");
    await db.createCollection("users");
    console.log("Database and collection created");
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await client.close();
  }
}

main();