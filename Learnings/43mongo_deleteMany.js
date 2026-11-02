const { MongoClient, HostAddress } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydb";

async function deleteMany() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("MongoDB Connected!!");

    const db = client.db(dbName);
    /* Delete many document */

    // We can use these to commented line too.....
    // let query = { address: /^O/ };
    // const result = await db.collection("customers").deleteMany({query});
    const result = await db.collection("customers").deleteMany({ address: /^O/ });
    console.log(result.deletedCount + " document(s) deleted");
  } catch (err) {
    console.error("Error : ", err.message);
  } finally {
    await client.close();
  }
}
deleteMany();
