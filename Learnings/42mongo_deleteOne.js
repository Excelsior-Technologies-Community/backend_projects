const { MongoClient, HostAddress } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydb";

async function deleteOne() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("MongoDB Connected!!");

    const db = client.db(dbName);
    /* Delete one document */

    // We can use these to commented line too.....
    // let query = { name: "param" };
    // const result = await db.collection("customers").deleteOne({query});
    const result = await db.collection("customers").deleteOne({ name: "param" });
    console.log(result.deletedCount + " document(s) deleted");
  } catch (err) {
    console.error("Error : ", err.message);
  } finally {
    await client.close();
  }
}
deleteOne();
