const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:27017";
const dbName = "mydb";

async function insertProducts() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    const products = [
      { _id: 154, name: "Chocolate Heaven" },
      { _id: 155, name: "Tasty Lemon" },
      { _id: 156, name: "Vanilla Dream" }
    ];

    const result = await db.collection("products").insertMany(products);
    console.log("Inserted count:", result.insertedCount);
  } catch (err) {
    console.error("MongoDB error:", err.message);
  } finally {
    await client.close();
  }
}

insertProducts();