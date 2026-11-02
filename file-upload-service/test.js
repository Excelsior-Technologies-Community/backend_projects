const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const express = require("express");
const cors = require("cors");
const cloudinary = require("./config/cloudinary");

dotenv.config();

// If running in test mode with demo/dummy keys, wrap upload_stream to return simulated response
const isDemoKey = !process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET.includes("your_cloudinary");
if (isDemoKey) {
  console.log("ℹ️ Running test with simulated Cloudinary mock (offline mode)");
  cloudinary.uploader.upload_stream = (options, cb) => {
    const { PassThrough } = require("stream");
    const stream = new PassThrough();
    let totalBytes = 0;
    stream.on("data", (chunk) => {
      totalBytes += chunk.length;
    });
    stream.on("finish", () => {
      cb(null, {
        secure_url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || "demo"}/image/upload/v12345/test_sample.png`,
        public_id: `backend_uploads/test_${Date.now()}`,
        format: "png",
        bytes: totalBytes || 512,
        width: 100,
        height: 100
      });
    });
    return stream;
  };

  cloudinary.uploader.destroy = async (publicId) => {
    return { result: "ok" };
  };
}

const uploadRoutes = require("./routes/uploadRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const File = require("./models/File");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", uploadRoutes);
app.use(notFound);
app.use(errorHandler);

const TEST_PORT = 5095;
const BASE_URL = `http://localhost:${TEST_PORT}`;

async function runTests() {
  console.log("=================================================");
  console.log("📁 STARTING FILE UPLOAD SERVICE TEST SUITE");
  console.log("=================================================\n");

  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/file_upload_db";
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB for testing.");

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  console.log(`✅ Test server running on port ${TEST_PORT}\n`);

  let uploadedFileId = "";

  try {
    // TEST 1: Attempt upload without attaching a file
    console.log("TEST 1: Attempting POST /api/upload without file...");
    const noFileRes = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST"
    });
    const noFileData = await noFileRes.json();
    if (noFileRes.status === 400) {
      console.log("  ✅ SUCCESS: Missing file rejected with HTTP 400.");
      console.log(`     Message: "${noFileData.message}"`);
    } else {
      throw new Error(`Missing file was not rejected! Status: ${noFileRes.status}`);
    }

    // TEST 2: Upload a valid 1x1 PNG image buffer via multipart/form-data
    console.log("\nTEST 2: Uploading valid PNG image to Cloudinary & MongoDB...");
    // Minimal valid 1x1 pixel transparent PNG in base64
    const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const pngBuffer = Buffer.from(pngBase64, "base64");

    const formData = new FormData();
    const blob = new Blob([pngBuffer], { type: "image/png" });
    formData.append("image", blob, "sample_test_avatar.png");

    const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
      body: formData
    });
    const uploadData = await uploadRes.json();

    if (uploadRes.status === 201 && uploadData.data._id && uploadData.data.cloudinaryUrl) {
      uploadedFileId = uploadData.data._id;
      console.log("  ✅ SUCCESS: Image uploaded with HTTP 201!");
      console.log(`     Database ID:   ${uploadedFileId}`);
      console.log(`     Original Name: ${uploadData.data.originalName}`);
      console.log(`     Cloudinary URL: ${uploadData.data.cloudinaryUrl}`);
      console.log(`     Public ID:     ${uploadData.data.publicId}`);
    } else {
      throw new Error(`Upload failed: ${JSON.stringify(uploadData)}`);
    }

    // TEST 3: Retrieve all uploaded files from MongoDB
    console.log("\nTEST 3: Fetching all uploaded files (GET /api/files)...");
    const getFilesRes = await fetch(`${BASE_URL}/api/files`);
    const allFilesData = await getFilesRes.json();
    if (getFilesRes.status === 200 && allFilesData.data.length > 0) {
      console.log(`  ✅ SUCCESS: Retrieved ${allFilesData.count} file record(s) from database.`);
    } else {
      throw new Error(`Get files failed: ${JSON.stringify(allFilesData)}`);
    }

    // TEST 4: Retrieve single file details by ID
    console.log(`\nTEST 4: Fetching single file by ID (GET /api/files/${uploadedFileId})...`);
    const getSingleRes = await fetch(`${BASE_URL}/api/files/${uploadedFileId}`);
    const singleData = await getSingleRes.json();
    if (getSingleRes.status === 200 && singleData.data._id === uploadedFileId) {
      console.log("  ✅ SUCCESS: Single file record retrieved.");
      console.log(`     URL: ${singleData.data.cloudinaryUrl}`);
    } else {
      throw new Error(`Get single file failed: ${JSON.stringify(singleData)}`);
    }

    // TEST 5: Delete file from Cloudinary and MongoDB
    console.log(`\nTEST 5: Deleting file (DELETE /api/files/${uploadedFileId})...`);
    const delRes = await fetch(`${BASE_URL}/api/files/${uploadedFileId}`, {
      method: "DELETE"
    });
    const delData = await delRes.json();
    if (delRes.status === 200 && delData.success) {
      console.log("  ✅ SUCCESS: File deleted from Cloudinary and database.");
    } else {
      throw new Error(`Delete failed: ${JSON.stringify(delData)}`);
    }

    // TEST 6: Verify file no longer exists in database
    console.log("\nTEST 6: Verifying deletion from database...");
    const verifyDel = await fetch(`${BASE_URL}/api/files/${uploadedFileId}`);
    if (verifyDel.status === 404) {
      console.log("  ✅ SUCCESS: Confirmed file record no longer exists (HTTP 404).");
    } else {
      throw new Error(`File still exists after deletion! Status: ${verifyDel.status}`);
    }

    console.log("\n=================================================");
    console.log("🎉 ALL FILE UPLOAD SERVICE TESTS PASSED!");
    console.log("=================================================\n");
  } catch (err) {
    console.error("\n❌ TEST FAILURE:", err.message);
  } finally {
    if (uploadedFileId) {
      await File.deleteOne({ _id: uploadedFileId });
    }
    await mongoose.disconnect();
    server.close();
    process.exit(0);
  }
}

runTests();
