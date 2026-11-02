const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("mydb");
    const collection = db.collection("customers");

    const result = await collection.insertOne({
      name: "param",
      address: "Highway 51"
    });

    console.log("Inserted document ID:", result.insertedId);
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await client.close();
  }
}

main();