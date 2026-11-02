# 🚀 Mongo User & Product Management System

A full-stack, production-structured Node.js, Express, and MongoDB system providing:
- **User Authentication**: Registration, Nodemailer OTP verification (with 10-minute expiry), Resend OTP with cooldown throttling, and JWT Login (restricting unverified accounts).
- **Product Management (CRUD)**: Create, Read, Update, and Delete products with Multer memory storage and Cloudinary integration (folder `mongo_user_products`).
- **Image Lifecycle Management**:
  - Strict format validation (`jpg`, `jpeg`, `png`, `webp`) and 5MB size limit.
  - Image replacement support: automatically removes the old image asset from Cloudinary when a new image is uploaded.
  - Deletion cleanup: automatically deletes the Cloudinary image asset when a product is deleted.
- **Protected Product APIs**: JWT authentication middleware checks Bearer tokens.
- **Frontend**: Clean, lightweight Tailwind CSS interface for intuitive testing and operation.

---

## 📁 Project Structure

```
mongo-user-project/
├── config/
│   ├── db.js               # MongoDB Mongoose connection
│   ├── cloudinary.js       # Cloudinary configuration (credentials from .env)
│   └── email.js            # Nodemailer transporter & HTML OTP email template
├── controllers/
│   ├── authController.js    # register, verifyOTP, resendOTP, login, getMe
│   └── productController.js # createProduct, getAllProducts, getProductById, updateProduct, deleteProduct
├── middleware/
│   ├── auth.js             # JWT verification middleware
│   ├── upload.js           # Multer configuration with image filtering & 5MB limit
│   └── errorHandler.js     # Unified error handling (Multer, Mongoose, JWT)
├── models/
│   ├── User.js             # User schema with bcrypt password hashing & OTP fields
│   └── Product.js          # Product schema with Cloudinary URL & publicId
├── routes/
│   ├── authRoutes.js       # /api/auth endpoints
│   └── productRoutes.js    # /api/products endpoints
├── public/
│   └── index.html          # Responsive, simple Tailwind CSS frontend
├── .env                    # Active environment variables
├── .env.example            # Environment template
├── package.json            # Project dependencies & scripts
├── server.js               # Express app bootstrap & static hosting
└── test-api.js             # Automated 11-step integration test script
```

---

## 🛠️ Installation & Setup

1. **Navigate to the project directory**:
   ```bash
   cd e:\Backend\mongo-user-project
   ```

2. **Dependencies are already installed**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (`.env`)**:
   ```ini
   PORT=5005
   MONGO_URI=mongodb://localhost:27017/mongo_user_db

   JWT_SECRET=super_secret_jwt_key_mongo_user_2026
   JWT_EXPIRES_IN=7d

   # Cloudinary Credentials (configured)
   CLOUDINARY_CLOUD_NAME=wbsl15ub
   CLOUDINARY_API_KEY=788376528835699
   CLOUDINARY_API_SECRET=kZn0F08jyk6X1Y9AskhtCrt1rL8
   CLOUDINARY_FOLDER=mongo_user_products

   # Nodemailer SMTP Configuration
   # (If left empty, OTP will be printed prominently in the server console & dev response for instant frictionless testing)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=
   SMTP_PASS=
   EMAIL_FROM="Mongo User System" <noreply@mongouser.com>
   ```

4. **Start the Server**:
   ```bash
   npm run dev
   # Or: node server.js
   ```

5. **Open the Frontend**:
   Open [http://localhost:5005](http://localhost:5005) in your web browser.

---

## 🧪 Automated Testing

Run the automated 11-step end-to-end integration test:
```bash
npm test
# Or: node test-api.js
```

### Verified Test Cases:
1. `GET /api/health` - Server and Cloudinary connectivity.
2. `POST /api/auth/register` - User registration with password hashing & OTP generation.
3. `POST /api/auth/login` - Verify unverified accounts are strictly blocked.
4. `POST /api/auth/verify-otp` - Verify invalid OTP rejection.
5. `POST /api/auth/verify-otp` - Verify valid OTP unlocks the account.
6. `POST /api/auth/login` - Successful verified login & JWT acquisition.
7. `GET /api/auth/me` - Authenticated profile fetch.
8. `POST /api/products` - Product creation with Multer buffer stream to Cloudinary (`mongo_user_products`).
9. `GET /api/products` & `GET /api/products/:id` - Search, filter, and single product fetch.
10. `PUT /api/products/:id` - Product update with image replacement & Cloudinary asset destruction.
11. `DELETE /api/products/:id` - Product deletion & Cloudinary image removal.

---

## 📡 API Endpoints Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user & dispatch OTP email | No |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit OTP code & activate account | No |
| `POST` | `/api/auth/resend-otp` | Resend new OTP (60s cooldown) | No |
| `POST` | `/api/auth/login` | Login with email & password (only verified users) | No |
| `GET` | `/api/auth/me` | Fetch currently logged in user profile | **Yes (JWT)** |

### Product Endpoints (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Fetch all products (supports `?search=`, `?category=`, `?page=`, `?limit=`) | No |
| `GET` | `/api/products/:id` | Fetch single product details | No |
| `POST` | `/api/products` | Create product with Multer image upload to Cloudinary | **Yes (JWT)** |
| `PUT` | `/api/products/:id` | Update product fields & replace image (deletes old image) | **Yes (JWT)** |
| `DELETE` | `/api/products/:id` | Delete product & destroy Cloudinary image | **Yes (JWT)** |
