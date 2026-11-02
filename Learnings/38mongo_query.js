const { MongoClient, HostAddress } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydb";

async function findQuery() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("MongoDB Connected!!");

    const db = client.db(dbName);
    /*Return only the documents with the address "Park Lane 38":*/

    // We can use these to commented line too.....
    // let query = { address: "Park Lane 38" };
    // const result = await db.collection("customers").find({query}).toArray();
    const result = await db.collection("customers").find({ address: "Park Lane 38" }).toArray();
    console.log(result);
  } catch (err) {
    console.error("Error", err.message);
  } finally {
    await client.close();
  }
}
findQuery();
