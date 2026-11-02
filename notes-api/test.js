const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const express = require("express");
const cors = require("cors");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const User = require("./models/User");
const Note = require("./models/Note");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use(notFound);
app.use(errorHandler);

const TEST_PORT = 5096;
const BASE_URL = `http://localhost:${TEST_PORT}`;

async function runTests() {
  console.log("=================================================");
  console.log("📝 STARTING NOTES API TEST SUITE");
  console.log("=================================================\n");

  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/notes_api_db";
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB for testing.");

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  console.log(`✅ Test server running on port ${TEST_PORT}\n`);

  const timestamp = Date.now();
  const user1Email = `user1_notes_${timestamp}@example.com`;
  const user2Email = `user2_notes_${timestamp}@example.com`;
  const password = "password123";

  let token1 = "";
  let token2 = "";
  let note1Id = "";
  let note2Id = "";

  try {
    // 1. Register User 1
    console.log("TEST 1: Registering User 1 (Alice)...");
    const res1 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Alice Notes", email: user1Email, password })
    });
    const data1 = await res1.json();
    token1 = data1.data.token;
    console.log("  ✅ SUCCESS: User 1 registered.");

    // 2. Register User 2
    console.log("\nTEST 2: Registering User 2 (Bob)...");
    const res2 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Bob Notes", email: user2Email, password })
    });
    const data2 = await res2.json();
    token2 = data2.data.token;
    console.log("  ✅ SUCCESS: User 2 registered.");

    // 3. User 1 creates Note 1
    console.log("\nTEST 3: User 1 creates 'Meeting Notes - Project Alpha'...");
    const create1 = await fetch(`${BASE_URL}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token1}`
      },
      body: JSON.stringify({
        title: "Meeting Notes - Project Alpha",
        content: "Budget review and sprint planning discussed.",
        category: "Work"
      })
    });
    const note1Data = await create1.json();
    note1Id = note1Data.data._id;
    console.log("  ✅ SUCCESS: Note 1 created. ID:", note1Id);

    // 4. User 1 creates Note 2
    console.log("\nTEST 4: User 1 creates 'Grocery Shopping List'...");
    const create2 = await fetch(`${BASE_URL}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token1}`
      },
      body: JSON.stringify({
        title: "Grocery Shopping List",
        content: "Almond milk, whole wheat bread, eggs, and coffee beans.",
        category: "Personal"
      })
    });
    const note2Data = await create2.json();
    note2Id = note2Data.data._id;
    console.log("  ✅ SUCCESS: Note 2 created. ID:", note2Id);

    // 5. User 2 creates Note 3
    console.log("\nTEST 5: User 2 creates 'Bob Secret Plan'...");
    const create3 = await fetch(`${BASE_URL}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token2}`
      },
      body: JSON.stringify({
        title: "Bob Secret Plan",
        content: "Top secret strategy for Q3.",
        category: "Confidential"
      })
    });
    const note3Data = await create3.json();
    console.log("  ✅ SUCCESS: Note 3 created by User 2. ID:", note3Data.data._id);

    // 6. Privacy Isolation Verification
    console.log("\nTEST 6: 🛡️ PRIVACY CHECK: User 1 retrieves notes...");
    const getNotes1 = await fetch(`${BASE_URL}/api/notes`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    const notes1Data = await getNotes1.json();
    if (notes1Data.count === 2 && !notes1Data.data.some((n) => n.title.includes("Bob"))) {
      console.log("  ✅ SUCCESS: User 1 only sees their own 2 notes. User 2's note is private!");
    } else {
      throw new Error(`Privacy breach! User 1 notes: ${JSON.stringify(notes1Data)}`);
    }

    // 7. Search by Title
    console.log("\nTEST 7: 🔍 SEARCH BY TITLE: User 1 searches for 'Meeting'...");
    const searchRes = await fetch(`${BASE_URL}/api/notes?search=Meeting`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    const searchData = await searchRes.json();
    if (searchData.count === 1 && searchData.data[0].title.includes("Meeting")) {
      console.log(`  ✅ SUCCESS: Found 1 matching note: "${searchData.data[0].title}"`);
    } else {
      throw new Error(`Search failed: ${JSON.stringify(searchData)}`);
    }

    // 8. Filter by Date (Today)
    const todayStr = new Date().toISOString().split("T")[0];
    console.log(`\nTEST 8: 📅 FILTER BY DATE: User 1 filters by date=${todayStr}...`);
    const dateRes = await fetch(`${BASE_URL}/api/notes?date=${todayStr}`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    const dateData = await dateRes.json();
    if (dateData.count === 2) {
      console.log(`  ✅ SUCCESS: Successfully filtered notes created on ${todayStr} (Count: ${dateData.count})`);
    } else {
      throw new Error(`Date filter failed: ${JSON.stringify(dateData)}`);
    }

    // 9. Filter by Date Range
    console.log(`\nTEST 9: 📅 FILTER BY DATE RANGE: User 1 filters by startDate and endDate...`);
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    const rangeRes = await fetch(`${BASE_URL}/api/notes?startDate=${todayStr}&endDate=${tomorrowStr}`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    const rangeData = await rangeRes.json();
    if (rangeData.count === 2) {
      console.log(`  ✅ SUCCESS: Date range filter returned ${rangeData.count} note(s).`);
    } else {
      throw new Error(`Date range filter failed: ${JSON.stringify(rangeData)}`);
    }

    // 10. Security Isolation: User 2 attempts to EDIT User 1's note (Expect 403)
    console.log("\nTEST 10: 🛡️ SECURITY CHECK: User 2 attempts to EDIT User 1's note...");
    const unauthEdit = await fetch(`${BASE_URL}/api/notes/${note1Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token2}`
      },
      body: JSON.stringify({ title: "Tampered Title" })
    });
    const unauthEditData = await unauthEdit.json();
    if (unauthEdit.status === 403) {
      console.log("  ✅ SUCCESS: Edit blocked with HTTP 403 Forbidden!");
      console.log(`     Message: "${unauthEditData.message}"`);
    } else {
      throw new Error(`Security breach! Status: ${unauthEdit.status}`);
    }

    // 11. Security Isolation: User 2 attempts to DELETE User 1's note (Expect 403)
    console.log("\nTEST 11: 🛡️ SECURITY CHECK: User 2 attempts to DELETE User 1's note...");
    const unauthDel = await fetch(`${BASE_URL}/api/notes/${note1Id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token2}` }
    });
    const unauthDelData = await unauthDel.json();
    if (unauthDel.status === 403) {
      console.log("  ✅ SUCCESS: Delete blocked with HTTP 403 Forbidden!");
      console.log(`     Message: "${unauthDelData.message}"`);
    } else {
      throw new Error(`Security breach! Status: ${unauthDel.status}`);
    }

    // 12. User 1 updates her own note
    console.log("\nTEST 12: User 1 updates her own note...");
    const updateRes = await fetch(`${BASE_URL}/api/notes/${note1Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token1}`
      },
      body: JSON.stringify({
        title: "Meeting Notes - Project Alpha (Approved)",
        category: "Executive"
      })
    });
    const updateData = await updateRes.json();
    if (updateRes.status === 200 && updateData.data.title.includes("(Approved)")) {
      console.log("  ✅ SUCCESS: Note updated successfully.");
    } else {
      throw new Error(`Update note failed: ${JSON.stringify(updateData)}`);
    }

    // 13. User 1 deletes her own note
    console.log("\nTEST 13: User 1 deletes her own note...");
    const delRes = await fetch(`${BASE_URL}/api/notes/${note1Id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token1}` }
    });
    if (delRes.status === 200) {
      console.log("  ✅ SUCCESS: Note deleted successfully.");
    } else {
      throw new Error(`Delete failed: ${delRes.status}`);
    }

    console.log("\n=================================================");
    console.log("🎉 ALL NOTES API TESTS PASSED SUCCESSFULLY!");
    console.log("=================================================\n");
  } catch (err) {
    console.error("\n❌ TEST FAILURE:", err.message);
  } finally {
    await User.deleteMany({ email: { $in: [user1Email, user2Email] } });
    await Note.deleteMany({ title: /Meeting|Grocery|Bob/ });
    console.log("🧹 Cleaned up test data.");
    await mongoose.disconnect();
    server.close();
    process.exit(0);
  }
}

runTests();
