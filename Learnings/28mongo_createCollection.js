const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

async function createCollection() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const dbo = client.db("mydb");

    // Check if collection exists
    const collections = await dbo.listCollections({ name: "customers" }).toArray();

    if (collections.length > 0) {
      console.log("Collection 'customers' already exists.");
    } else {
      // Create collection
      await dbo.createCollection("customers");
      console.log("Collection created!");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

createCollection();