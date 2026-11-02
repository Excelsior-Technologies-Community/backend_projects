const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const express = require("express");
const cors = require("cors");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const User = require("./models/User");
const Post = require("./models/Post");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use(notFound);
app.use(errorHandler);

const TEST_PORT = 5097;
const BASE_URL = `http://localhost:${TEST_PORT}`;

async function runTests() {
  console.log("=================================================");
  console.log("📝 STARTING BLOG API WITH AUTH TEST SUITE");
  console.log("=================================================\n");

  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/blog_api_db";
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB for testing.");

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  console.log(`✅ Test server running on port ${TEST_PORT}\n`);

  const timestamp = Date.now();
  const userAEmail = `author_alice_${timestamp}@example.com`;
  const userBEmail = `reader_bob_${timestamp}@example.com`;
  const password = "password123";

  let tokenA = "";
  let tokenB = "";
  let userAId = "";
  let userBId = "";
  let createdPostId = "";

  try {
    // 1. Register User A (Author Alice)
    console.log("TEST 1: Registering User A (Alice - Author)...");
    const resA = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Alice Author", email: userAEmail, password })
    });
    const dataA = await resA.json();
    if (resA.status === 201 && dataA.data.token) {
      tokenA = dataA.data.token;
      userAId = dataA.data.user._id;
      console.log("  ✅ SUCCESS: User A registered.");
      console.log(`     User A ID: ${userAId}`);
    } else {
      throw new Error(`Register User A failed: ${JSON.stringify(dataA)}`);
    }

    // 2. Register User B (Bob)
    console.log("\nTEST 2: Registering User B (Bob - Second User)...");
    const resB = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Bob Reader", email: userBEmail, password })
    });
    const dataB = await resB.json();
    if (resB.status === 201 && dataB.data.token) {
      tokenB = dataB.data.token;
      userBId = dataB.data.user._id;
      console.log("  ✅ SUCCESS: User B registered.");
      console.log(`     User B ID: ${userBId}`);
    } else {
      throw new Error(`Register User B failed: ${JSON.stringify(dataB)}`);
    }

    // 3. User A creates a blog post
    console.log("\nTEST 3: User A creates a blog post...");
    const createPostRes = await fetch(`${BASE_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: "Mastering Node.js and MongoDB REST APIs",
        content: "In this comprehensive guide, we build intermediate backend architectures with JWT authentication.",
        tags: ["nodejs", "mongodb", "backend"]
      })
    });
    const postData = await createPostRes.json();
    if (createPostRes.status === 201 && postData.data._id) {
      createdPostId = postData.data._id;
      console.log("  ✅ SUCCESS: Blog post created with HTTP 201.");
      console.log(`     Post ID: ${createdPostId}`);
      console.log(`     Title:   "${postData.data.title}"`);
      console.log(`     Author:  ${postData.data.author.name} (${postData.data.author.email})`);
    } else {
      throw new Error(`Create post failed: ${JSON.stringify(postData)}`);
    }

    // 4. Public route: Get all posts
    console.log("\nTEST 4: Public access: Fetching all blog posts...");
    const getPostsRes = await fetch(`${BASE_URL}/api/posts`);
    const allPostsData = await getPostsRes.json();
    if (getPostsRes.status === 200 && allPostsData.data.length > 0) {
      console.log(`  ✅ SUCCESS: Retrieved ${allPostsData.data.length} post(s).`);
      console.log(`     First post author populated: ${allPostsData.data[0].author.name}`);
    } else {
      throw new Error(`Get all posts failed: ${JSON.stringify(allPostsData)}`);
    }

    // 5. Public route: Get single post by ID
    console.log("\nTEST 5: Public access: Fetching single post by ID...");
    const getSingleRes = await fetch(`${BASE_URL}/api/posts/${createdPostId}`);
    const singleData = await getSingleRes.json();
    if (getSingleRes.status === 200 && singleData.data._id === createdPostId) {
      console.log("  ✅ SUCCESS: Single post fetched successfully.");
    } else {
      throw new Error(`Get single post failed: ${JSON.stringify(singleData)}`);
    }

    // 6. Security Check: User B attempts to EDIT User A's post (Expect 403 Forbidden!)
    console.log("\nTEST 6: 🛡️ SECURITY CHECK: User B attempts to EDIT User A's post...");
    const unauthEditRes = await fetch(`${BASE_URL}/api/posts/${createdPostId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenB}`
      },
      body: JSON.stringify({
        title: "Hacked by User B!"
      })
    });
    const unauthEditData = await unauthEditRes.json();
    if (unauthEditRes.status === 403) {
      console.log("  ✅ SUCCESS: Unauthorized edit correctly BLOCKED with HTTP 403 Forbidden!");
      console.log(`     Server message: "${unauthEditData.message}"`);
    } else {
      throw new Error(`Security breach! User B was able to edit User A's post! Status: ${unauthEditRes.status}`);
    }

    // 7. Security Check: User B attempts to DELETE User A's post (Expect 403 Forbidden!)
    console.log("\nTEST 7: 🛡️ SECURITY CHECK: User B attempts to DELETE User A's post...");
    const unauthDelRes = await fetch(`${BASE_URL}/api/posts/${createdPostId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokenB}`
      }
    });
    const unauthDelData = await unauthDelRes.json();
    if (unauthDelRes.status === 403) {
      console.log("  ✅ SUCCESS: Unauthorized delete correctly BLOCKED with HTTP 403 Forbidden!");
      console.log(`     Server message: "${unauthDelData.message}"`);
    } else {
      throw new Error(`Security breach! User B was able to delete User A's post! Status: ${unauthDelRes.status}`);
    }

    // 8. Author User A updates her own post
    console.log("\nTEST 8: Author User A updates her own post...");
    const authUpdateRes = await fetch(`${BASE_URL}/api/posts/${createdPostId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: "Mastering Node.js and MongoDB REST APIs (Updated Edition)",
        content: "Updated content with advanced authorization patterns and best practices."
      })
    });
    const authUpdateData = await authUpdateRes.json();
    if (authUpdateRes.status === 200 && authUpdateData.data.title.includes("(Updated Edition)")) {
      console.log("  ✅ SUCCESS: Author updated own post with HTTP 200.");
      console.log(`     New title: "${authUpdateData.data.title}"`);
    } else {
      throw new Error(`Author update failed: ${JSON.stringify(authUpdateData)}`);
    }

    // 9. Author User A deletes her own post
    console.log("\nTEST 9: Author User A deletes her own post...");
    const authDelRes = await fetch(`${BASE_URL}/api/posts/${createdPostId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokenA}`
      }
    });
    const authDelData = await authDelRes.json();
    if (authDelRes.status === 200) {
      console.log("  ✅ SUCCESS: Author deleted own post with HTTP 200.");
    } else {
      throw new Error(`Author delete failed: ${JSON.stringify(authDelData)}`);
    }

    // 10. Verify post is deleted
    console.log("\nTEST 10: Verifying post is deleted from database...");
    const verifyDelRes = await fetch(`${BASE_URL}/api/posts/${createdPostId}`);
    if (verifyDelRes.status === 404) {
      console.log("  ✅ SUCCESS: Confirmed post no longer exists (HTTP 404).");
    } else {
      throw new Error(`Post still accessible after deletion! Status: ${verifyDelRes.status}`);
    }

    console.log("\n=================================================");
    console.log("🎉 ALL BLOG API AND AUTHORIZATION TESTS PASSED!");
    console.log("=================================================\n");
  } catch (err) {
    console.error("\n❌ TEST FAILURE:", err.message);
  } finally {
    // Cleanup test users and posts
    await User.deleteMany({ email: { $in: [userAEmail, userBEmail] } });
    if (createdPostId) {
      await Post.deleteOne({ _id: createdPostId });
    }
    console.log("🧹 Cleaned up test data.");
    await mongoose.disconnect();
    server.close();
    process.exit(0);
  }
}

runTests();
