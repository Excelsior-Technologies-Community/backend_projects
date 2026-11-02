# 📁 File Upload Service (Level 2 - Intermediate)

An intermediate-level Node.js, Express, and MongoDB microservice that accepts image uploads using **Multer**, streams them directly to **Cloudinary**, and persists the image metadata and secure URL in **MongoDB**.

---

## 🚀 Key Features

- **Multer In-Memory Storage**: Efficiently buffers image data without writing temporary files to local disk.
- **Image Validation**: Only allows image mime types (`image/jpeg`, `image/png`, `image/webp`, `image/gif`) with a 5MB size limit.
- **Cloudinary Integration**: Direct streaming using `cloudinary.v2.uploader.upload_stream`.
- **MongoDB Persistence**: Stores original file name, secure HTTPS Cloudinary URL, public ID, format, dimensions, and byte size.
- **Asset Cleanup**: `DELETE /api/files/:id` removes the image asset from Cloudinary and deletes the record from MongoDB.

---

## 📁 Project Structure

```
file-upload-service/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── cloudinary.js         # Cloudinary SDK configuration
├── controllers/
│   └── uploadController.js   # Upload, fetch, and delete controllers
├── middleware/
│   ├── multerMiddleware.js   # Multer storage, size limits & file filter
│   └── errorMiddleware.js    # Multer & global error handling
├── models/
│   └── File.js               # File Schema in MongoDB
├── routes/
│   └── uploadRoutes.js       # /api/upload & /api/files routes
├── .env                      # Environment configurations
├── .env.example              # Sample environment template
├── package.json              # Project dependencies & scripts
├── server.js                 # Express server initialization
├── test.js                   # Automated test suite
└── README.md                 # Documentation
```

---

## ⚙️ Installation & Setup

1. **Navigate to project directory**:
   ```bash
   cd e:\Backend\file-upload-service
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Update `.env` with your Cloudinary credentials (get free keys from [cloudinary.com](https://cloudinary.com)):
   ```env
   PORT=5004
   MONGO_URI=mongodb://localhost:27017/file_upload_db
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_FOLDER=backend_uploads
   ```

4. **Start the server**:
   - For development:
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

5. **Run the Automated Test Suite**:
   ```bash
   npm test
   ```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Content-Type |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Upload image to Cloudinary & save to DB | `multipart/form-data` (field: `image`) |
| `GET` | `/api/files` | Get all uploaded files (Query: `?page=1&limit=20`) | `application/json` |
| `GET` | `/api/files/:id` | Get single file metadata by ID | `application/json` |
| `DELETE` | `/api/files/:id` | Delete image from Cloudinary & DB | `application/json` |

---

## 🧪 Testing with cURL / Postman

### 1. Upload an Image
```bash
curl -X POST http://localhost:5004/api/upload \
  -F "image=@/path/to/your/photo.jpg"
```

### 2. View All Uploaded Files
```bash
curl -X GET http://localhost:5004/api/files
```

### 3. Delete an Image
```bash
curl -X DELETE http://localhost:5004/api/files/<FILE_ID>
```
