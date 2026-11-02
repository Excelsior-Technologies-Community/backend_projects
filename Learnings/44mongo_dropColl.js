const { MongoClient, HostAddress } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydb";

async function deopCollection() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("MongoDB Connected!!");

    const db = client.db(dbName);
    
    /* Drop collection */

    const result = await db.collection("customers").drop();
    console.log("Collection dropped");
  } catch (err) {
    console.error("Error : ", err.message);
  } finally {
    await client.close();
  }
}
deopCollection();
