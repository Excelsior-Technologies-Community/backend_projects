const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

// We will import our express app logic by creating a small server instance for testing
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");
const { getProfile } = require("./controllers/authController");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/api/profile", protect, getProfile);
app.use(notFound);
app.use(errorHandler);

const TEST_PORT = 5098;
const BASE_URL = `http://localhost:${TEST_PORT}`;

async function runTests() {
  console.log("=================================================");
  console.log("🔐 STARTING AUTHENTICATION SYSTEM API TEST SUITE");
  console.log("=================================================\n");

  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/auth_system_db";
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB for testing.");

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  console.log(`✅ Test server running on port ${TEST_PORT}\n`);

  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = "securePassword123";
  let authToken = "";

  try {
    // TEST 1: Register New User
    console.log("TEST 1: Registering a new user...");
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alice Developer",
        email: testEmail,
        password: testPassword
      })
    });
    const regData = await regRes.json();
    if (regRes.status === 201 && regData.success && regData.data.token) {
      console.log("  ✅ SUCCESS: User registered with HTTP 201.");
      console.log(`     User ID: ${regData.data.user._id}`);
      console.log(`     Email:   ${regData.data.user.email}`);
      console.log(`     Password excluded from response: ${regData.data.user.password === undefined}`);
      authToken = regData.data.token;
    } else {
      throw new Error(`Register failed: ${JSON.stringify(regData)}`);
    }

    // TEST 2: Duplicate Email Rejection
    console.log("\nTEST 2: Attempting to register duplicate email...");
    const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Duplicate Alice",
        email: testEmail,
        password: "anotherPassword"
      })
    });
    const dupData = await dupRes.json();
    if (dupRes.status === 400) {
      console.log("  ✅ SUCCESS: Duplicate registration rejected with HTTP 400.");
      console.log(`     Message: "${dupData.message}"`);
    } else {
      throw new Error(`Duplicate registration was not blocked! Status: ${dupRes.status}`);
    }

    // TEST 3: Login with Invalid Password
    console.log("\nTEST 3: Logging in with WRONG password...");
    const wrongLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: "wrongPassword456"
      })
    });
    const wrongLoginData = await wrongLoginRes.json();
    if (wrongLoginRes.status === 401) {
      console.log("  ✅ SUCCESS: Invalid credentials rejected with HTTP 401.");
      console.log(`     Message: "${wrongLoginData.message}"`);
    } else {
      throw new Error(`Invalid login was not blocked! Status: ${wrongLoginRes.status}`);
    }

    // TEST 4: Login with Valid Credentials
    console.log("\nTEST 4: Logging in with VALID credentials...");
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const loginData = await loginRes.json();
    if (loginRes.status === 200 && loginData.data.token) {
      console.log("  ✅ SUCCESS: Login succeeded with HTTP 200.");
      console.log(`     JWT Token received: ${loginData.data.token.substring(0, 30)}...`);
      authToken = loginData.data.token; // Update token with login token
    } else {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }

    // TEST 5: Access Protected /profile Without Token
    console.log("\nTEST 5: Accessing protected /profile route WITHOUT token...");
    const noTokenRes = await fetch(`${BASE_URL}/api/auth/profile`);
    const noTokenData = await noTokenRes.json();
    if (noTokenRes.status === 401) {
      console.log("  ✅ SUCCESS: Unauthenticated access blocked with HTTP 401.");
      console.log(`     Message: "${noTokenData.message}"`);
    } else {
      throw new Error(`Unauthenticated route access not blocked! Status: ${noTokenRes.status}`);
    }

    // TEST 6: Access Protected /profile with Valid JWT Token
    console.log("\nTEST 6: Accessing protected /profile route WITH valid JWT token...");
    const profileRes = await fetch(`${BASE_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    const profileData = await profileRes.json();
    if (profileRes.status === 200 && profileData.data.user.email === testEmail) {
      console.log("  ✅ SUCCESS: Protected profile accessed with HTTP 200.");
      console.log(`     Authenticated User: ${profileData.data.user.name} (${profileData.data.user.email})`);
      console.log(`     Password field omitted: ${profileData.data.user.password === undefined}`);
    } else {
      throw new Error(`Profile access failed: ${JSON.stringify(profileData)}`);
    }

    // TEST 7: Access Direct /api/profile Alias
    console.log("\nTEST 7: Accessing direct /api/profile alias route...");
    const directProfileRes = await fetch(`${BASE_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    const directProfileData = await directProfileRes.json();
    if (directProfileRes.status === 200 && directProfileData.data.user.email === testEmail) {
      console.log("  ✅ SUCCESS: Direct /api/profile endpoint returned user profile.");
    } else {
      throw new Error(`Direct /api/profile failed: ${JSON.stringify(directProfileData)}`);
    }

    console.log("\n=================================================");
    console.log("🎉 ALL AUTHENTICATION SYSTEM TESTS PASSED!");
    console.log("=================================================\n");
  } catch (err) {
    console.error("\n❌ TEST FAILURE:", err.message);
  } finally {
    // Cleanup test user
    await User.deleteOne({ email: testEmail });
    console.log(`🧹 Cleaned up test user: ${testEmail}`);
    await mongoose.disconnect();
    server.close();
    process.exit(0);
  }
}

runTests();
