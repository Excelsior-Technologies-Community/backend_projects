const { MongoClient, HostAddress } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydb";

async function sortDescending() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("MongoDB Connected!!");

    const db = client.db(dbName);
    /* Sort element in descending order */

    // We can use these to commented line too.....
    // let sort = { name: 1 };
    // const result = await db.collection("customers").find().sort(sort).toArray();
    const result = await db.collection("customers").find().sort({ name: -1 }).toArray();
    console.log(result);
  } catch (err) {
    console.error("Error : ", err.message);
  } finally {
    await client.close();
  }
}
sortDescending();
