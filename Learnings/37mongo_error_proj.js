const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydb";

async function findFieldProjection() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("MongoDB Connected!!");

    const db = client.db(dbName);
    //Projection cannot have a mix of inclusion and exclusion.
    //You get an error if you specify both 0 and 1 values in the same object (except if one of the fields is the _id field):
    const result = await db
      .collection("customers")
      .find({}, { projection: { name: 1, address: 0 } })
      .toArray();
    console.log(result);
  } catch (err) {
    console.error("Error", err.message);
  } finally {
    await client.close();
  }
}
findFieldProjection();
