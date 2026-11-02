const { MongoClient, HostAddress } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydb";

async function findFieldProjection() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("MongoDB Connected!!");

    const db = client.db(dbName);
    //Exclude "_id" field in the result:
    const result = await db.collection("customers").find({}, { projection: {_id:0, name:1, address:1} } ).toArray();
    console.log(result);
  } catch (err) {
    console.error("Error", err.message);
  } finally {
    await client.close();
  }
}
findFieldProjection();
