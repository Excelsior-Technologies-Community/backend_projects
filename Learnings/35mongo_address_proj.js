const { MongoClient, HostAddress } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydb";

async function findFieldProjection() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("MongoDB Connected!!");

    const db = client.db(dbName);
    //Exclude "address" field in the result: and give everything
    const result = await db.collection("customers").find({}, { projection: { address:0 } } ).toArray();
    console.log(result);
  } catch (err) {
    console.error("Error", err.message);
  } finally {
    await client.close();
  }
}
findFieldProjection();
