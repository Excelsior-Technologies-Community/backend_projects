const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5006;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// 1x1 transparent PNG buffer for testing Multer image upload
const SAMPLE_PNG_BUFFER = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
);

// Second 1x1 PNG for replacement test
const REPLACEMENT_PNG_BUFFER = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

async function runTests() {
  console.log(`\n======================================================`);
  console.log(`🧪 Running MySQL Integration Tests on ${BASE_URL}`);
  console.log(`======================================================\n`);

  const uniqueId = Date.now();
  const testUser = {
    name: `MySQL Tester ${uniqueId}`,
    email: `mysql_test_${uniqueId}@example.com`,
    password: "Password123!"
  };

  let token = "";
  let createdProductId = "";
  let registeredOtp = "";
  let uploadedImageFilename = "";

  try {
    // 1. Health Check
    console.log("➡️ [1/11] Checking /api/health...");
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    if (!healthRes.ok) throw new Error("Health check failed");
    console.log(`   ✅ Status: ${healthData.status}, Database: ${healthData.database.type} (Connected: ${healthData.database.connected})`);

    // 2. User Registration
    console.log(`\n➡️ [2/11] Registering user: ${testUser.email}...`);
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser)
    });
    const regData = await regRes.json();
    if (!regRes.ok) throw new Error(regData.message || "Registration failed");
    console.log(`   ✅ Registration response: ${regData.message}`);

    // Read OTP from registration response (debugOtp) or MySQL
    if (regData.data && regData.data.debugOtp) {
      registeredOtp = regData.data.debugOtp;
    } else {
      // Connect to MySQL to read OTP directly
      const mysql = require("mysql2/promise");
      const conn = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "mysql_user_db"
      });
      const [rows] = await conn.execute("SELECT otp FROM users WHERE email = ? LIMIT 1", [testUser.email]);
      registeredOtp = rows[0]?.otp;
      await conn.end();
    }
    console.log(`   🔑 Obtained OTP for verification: ${registeredOtp}`);

    // 3. Verify Login is Blocked Before OTP Verification
    console.log("\n➡️ [3/11] Verifying that login is blocked for unverified accounts...");
    const preLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const preLoginData = await preLoginRes.json();
    if (preLoginRes.status === 403 && preLoginData.requiresVerification) {
      console.log(`   ✅ Successfully blocked unverified login: "${preLoginData.message}"`);
    } else {
      throw new Error(`Expected 403 blocked login, got: ${preLoginRes.status}`);
    }

    // 4. Verify OTP Expiry & Code Validation
    console.log("\n➡️ [4/11] Testing invalid OTP rejection...");
    const badOtpRes = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testUser.email, otp: "000000" })
    });
    const badOtpData = await badOtpRes.json();
    if (badOtpRes.status === 400) {
      console.log(`   ✅ Correctly rejected invalid OTP: "${badOtpData.message}"`);
    } else {
      throw new Error(`Expected 400 for bad OTP, got: ${badOtpRes.status}`);
    }

    // 5. Verify Valid OTP
    console.log(`\n➡️ [5/11] Verifying with valid OTP (${registeredOtp})...`);
    const verifyRes = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testUser.email, otp: registeredOtp })
    });
    const verifyData = await verifyRes.json();
    if (!verifyRes.ok) throw new Error(verifyData.message || "OTP verification failed");
    console.log(`   ✅ User verified! isVerified: ${verifyData.user.isVerified}`);

    // 6. User Login with Verified Account
    console.log("\n➡️ [6/11] Logging in with verified account...");
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message || "Login failed");
    token = loginData.token;
    console.log(`   ✅ Login successful! JWT Token: ${token.substring(0, 30)}...`);

    // 7. Verify Protected Auth Route /api/auth/me
    console.log("\n➡️ [7/11] Testing GET /api/auth/me with JWT...");
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const meData = await meRes.json();
    if (!meRes.ok) throw new Error("GET /api/auth/me failed");
    console.log(`   ✅ Successfully authenticated as: ${meData.user.name} (${meData.user.email})`);

    // 8. Create Product with Multer Image Upload
    console.log("\n➡️ [8/11] Creating product with image upload...");
    const formData = new FormData();
    formData.append("title", `MySQL Headphones ${uniqueId}`);
    formData.append("price", "99.50");
    formData.append("category", "Electronics");
    formData.append("stock", "30");
    formData.append("description", "Premium noise cancellation wireless headphones");
    const imageBlob = new Blob([SAMPLE_PNG_BUFFER], { type: "image/png" });
    formData.append("image", imageBlob, "headphones.png");

    const createRes = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const createData = await createRes.json();
    if (!createRes.ok) throw new Error(createData.message || "Create product failed");
    createdProductId = createData.data.id;
    uploadedImageFilename = createData.data.imageFilename;
    console.log(`   ✅ Product created: ID=${createdProductId}`);
    console.log(`   🖼️ Image URL: ${createData.data.imageUrl}`);
    if (
      !createData.data.imageUrl.startsWith("https://res.cloudinary.com/") ||
      !uploadedImageFilename
    ) {
      throw new Error("Product image was not stored in Cloudinary.");
    }
    console.log(`   ☁️ Cloudinary public ID: ${uploadedImageFilename}`);

    // 9. Get All Products & Single Product
    console.log("\n➡️ [9/11] Fetching all products & single product...");
    const allRes = await fetch(`${BASE_URL}/api/products?search=${uniqueId}`);
    const allData = await allRes.json();
    if (!allRes.ok) throw new Error("Fetch products failed");
    console.log(`   ✅ Found ${allData.count} matching product(s).`);

    const singleRes = await fetch(`${BASE_URL}/api/products/${createdProductId}`);
    const singleData = await singleRes.json();
    if (!singleRes.ok) throw new Error("Fetch single product failed");
    console.log(`   ✅ Retrieved details for: "${singleData.data.title}" by ${singleData.data.createdBy?.name}`);

    // 10. Update Product with Image Replacement
    console.log("\n➡️ [10/11] Updating product & replacing existing image...");
    const oldImageFile = uploadedImageFilename;
    const updateFormData = new FormData();
    updateFormData.append("title", `Updated MySQL Headphones ${uniqueId}`);
    updateFormData.append("price", "129.99");
    const replacementBlob = new Blob([REPLACEMENT_PNG_BUFFER], { type: "image/png" });
    updateFormData.append("image", replacementBlob, "new_headphones.png");

    const updateRes = await fetch(`${BASE_URL}/api/products/${createdProductId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: updateFormData
    });
    const updateData = await updateRes.json();
    if (!updateRes.ok) throw new Error(updateData.message || "Update product failed");
    console.log(`   ✅ Product updated! New Title: "${updateData.data.title}", Price: $${updateData.data.price}`);
    console.log(`   🖼️ New Image URL: ${updateData.data.imageUrl}`);

    if (updateData.previousCloudinaryImageDeleted !== true) {
      throw new Error("Previous Cloudinary image was not removed after replacement.");
    }
    if (updateData.data.imageFilename === oldImageFile) {
      throw new Error("Image replacement did not store a new Cloudinary asset.");
    }
    console.log("   ✅ Previous Cloudinary asset removed after replacement.");

    // 11. Delete Product & Associated Cloudinary Image
    console.log(`\n➡️ [11/11] Deleting product ${createdProductId}...`);
    const newImageFilename = updateData.data.imageFilename;
    const delRes = await fetch(`${BASE_URL}/api/products/${createdProductId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      body: ""
    });
    const delData = await delRes.json();
    if (!delRes.ok) throw new Error(delData.message || "Delete product failed");
    console.log(`   ✅ Product deleted from MySQL: "${delData.data.title}"`);
    if (delData.data.cloudinaryImageDeleted !== true) {
      throw new Error("Product was deleted, but its Cloudinary image was not removed.");
    }

    console.log(`   ☁️ Cloudinary asset removed: ${newImageFilename}`);

    console.log(`\n======================================================`);
    console.log(`🎉 ALL 11 TEST CASES PASSED WITH 100% SUCCESS!`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error(`\n❌ TEST FAILED: ${err.message}`);
    process.exit(1);
  }
}

runTests();
