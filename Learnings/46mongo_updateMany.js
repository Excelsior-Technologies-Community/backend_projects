const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydb";

async function updateManyProduct() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("MongoDB Connected!!");

    const db = client.db(dbName);

    let myquery = { name: { $regex: "^U" } };
    let newvalues = { $set: { name: "Many Updates", address: "New Location" } };

    const result = await db
      .collection("products")
      .updateMany(myquery, newvalues);

    console.log(result.modifiedCount + " document updated");  
    console.log(result);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.close();
  }
}

updateManyProduct();