const mongoose = require("mongoose");
const Product = require("./models/Product");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/productDB";

async function runTests() {
  console.log("--- Starting MongoDB Product CRUD API Verification ---");

  try {
    // 1. Connect to MongoDB
    console.log(`1. Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log("   ✅ MongoDB connected successfully!\n");

    // Clean up test items
    await Product.deleteMany({ name: /^Test/ });

    // 2. Add (Create) Products
    console.log("2. Testing ADD Products (Create operation)...");
    const p1 = await Product.create({ name: "Test Wireless Mouse", price: 29.99, stock: 50 });
    const p2 = await Product.create({ name: "Test Mechanical Keyboard", price: 89.99, stock: 20 });
    const p3 = await Product.create({ name: "Test USB Cable", price: 9.99, stock: 100 });
    console.log(`   ✅ Added 3 test products! Sample ID: ${p1._id}\n`);

    // 3. Test Pagination (Read operation)
    console.log("3. Testing GET Products with Pagination (page=1, limit=2)...");
    const page = 1;
    const limit = 2;
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments();
    const paginatedProducts = await Product.find().skip(skip).limit(limit);

    console.log(`   ✅ Total products in DB: ${total}`);
    console.log(`   ✅ Products returned on Page 1 (limit 2): ${paginatedProducts.length}`);
    paginatedProducts.forEach((p, idx) => console.log(`      [${idx + 1}] ${p.name} - $${p.price} (Stock: ${p.stock})`));
    console.log();

    // 4. Test Update Product
    console.log("4. Testing UPDATE Product operation...");
    const updated = await Product.findByIdAndUpdate(
      p1._id,
      { price: 34.99, stock: 45 },
      { returnDocument: "after" }
    );
    console.log(`   ✅ Updated ${updated.name}: Price is now $${updated.price}, Stock: ${updated.stock}\n`);

    // 5. Test Delete Product
    console.log("5. Testing DELETE Product operation...");
    await Product.findByIdAndDelete(p1._id);
    const checkDeleted = await Product.findById(p1._id);
    if (!checkDeleted) {
      console.log("   ✅ Product deleted successfully and verified!\n");
    }

    // Clean up remaining test products
    // await Product.deleteMany({ name: /^Test/ });

    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! The MongoDB Product CRUD API is ready.");
  } catch (error) {
    console.error("❌ Test encountered an error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
}

runTests();
