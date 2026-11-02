const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "mydb";

async function updateProduct() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("MongoDB Connected!!");

    const db = client.db(dbName);

    let myquery = { name: "Tasty Lemon" };
    let newvalues = { $set: { name: "Updated Product", address: "New Location" } };

    const result = await db
      .collection("products")
      .updateOne(myquery, newvalues);

    console.log("1 document updated");  
    console.log(result);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.close();
  }
}

updateProduct();