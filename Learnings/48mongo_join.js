const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "mydb";

async function createCollectionsAndJoin() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);

    // Insert products
    await db.collection("products").insertMany([
      { _id: 154, name: "Chocolate Haven" },
      { _id: 155, name: "Tasty Lemon" },
      { _id: 156, name: "Vanilla Dreams" }
    ]);

    // Insert orders
    await db.collection("orders").insertMany([
      { _id: 1, product_id: 154, status: 1 },
      { _id: 2, product_id: 155, status: 1 }
    ]);

    const result = await db.collection("orders").aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "orderdetails"
        }
      }
    ]).toArray();

    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.close();
  }
}

createCollectionsAndJoin();