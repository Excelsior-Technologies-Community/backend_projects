# 🐬 MySQL User & Product Management System

A full-stack, production-structured Node.js, Express, and MySQL system matching the architecture of `mongo-user-project`, but built for **MySQL (with connection pooling via `mysql2`)**.

---

## 🌟 Key Features

1. **User Authentication & Verification**:
   - **User Registration API**: Proper input validation (email format, name length, password strength) and secure password hashing using `bcryptjs`.
   - **Nodemailer OTP Email**: Dispatches 6-digit verification OTP codes upon registration using responsive HTML email templates (with automatic console fallback for frictionless local testing).
   - **OTP Verification API**: Validates 6-digit OTP codes with 10-minute expiry checks and activates the user account.
   - **Resend OTP API**: Allows unverified users to request fresh OTPs with a **60-second cooldown rate limit** to prevent abuse.
   - **User Login API**: Strict JWT authentication — **unverified users are blocked** from logging in until their email is verified.
   - **Protected Profile API**: Fetch user profile (`/api/auth/me`) using JWT Bearer token authentication middleware.

2. **Product Management (CRUD)**:
   - **Create Product API**: Multer validates and buffers the image, then uploads it to **Cloudinary**. The secure URL and Cloudinary public ID are stored in MySQL.
   - **Get All Products API**: Retrieves product listings with pagination (`?page=`, `?limit=`), keyword search (`?search=`), and category filtering (`?category=`).
   - **Get Single Product API**: Fetches individual product details by ID with creator details (`JOIN users`).
   - **Update Product API**: Supports text updates and replacing the Cloudinary image, then removes the previous Cloudinary asset.
   - **Delete Product API**: Removes product records from MySQL and attempts to delete the associated Cloudinary asset.

3. **Security & Validation**:
   - **Image Format Validation**: Strictly allows only `jpg`, `jpeg`, `png`, and `webp` images.
   - **File Size Limit**: Configured for 5MB max file size with user-friendly error messages.
   - **JWT Authentication Middleware**: Secures all product creation, modification, and deletion endpoints.
   - **SQL Injection Protection**: Uses parameterized prepared statements throughout.

4. **Frontend UI**:
   - Built with Tailwind CSS and Inter typography in `public/index.html`.
   - Features real-time MySQL health status, OTP auto-fill for testing, image upload preview, product catalog with search/filter, and modal dialogues.

---

## 📁 Project Structure

```
mysql-user-project/
├── config/
│   ├── db.js               # MySQL connection pool (mysql2/promise) & table auto-initialization
│   ├── email.js            # Nodemailer transporter & HTML OTP email template (with dev fallback)
│   └── cloudinary.js       # Cloudinary upload and image deletion helpers
├── controllers/
│   ├── authController.js   # register, verifyOTP, resendOTP, login, getMe
│   └── productController.js# createProduct, getAllProducts, getProductById, updateProduct, deleteProduct
├── middleware/
│   ├── auth.js             # JWT verification middleware
│   ├── upload.js           # Multer memory upload configuration (jpg/jpeg/png/webp, 5MB limit)
│   └── errorHandler.js     # Unified error handling (Multer, MySQL ER_DUP_ENTRY, JWT)
├── models/
│   ├── userModel.js        # MySQL user queries & helper functions
│   └── productModel.js     # MySQL product queries, pagination, & JOINs
├── routes/
│   ├── authRoutes.js       # /api/auth endpoints
│   └── productRoutes.js    # /api/products endpoints
├── public/
│   └── index.html          # Responsive interactive Tailwind CSS frontend
├── .env                    # Environment variables
├── .env.example            # Environment template
├── package.json            # Project dependencies & scripts
├── schema.sql              # Clean SQL schema script for MySQL CLI or phpMyAdmin
├── server.js               # Express application bootstrap & static routes
└── test-api.js             # Automated 11-step integration test script
```

---

## 🗄️ MySQL Database Schema

You can inspect [schema.sql](file:///e:/Backend/mysql-user-project/schema.sql) or run it directly in MySQL:

```sql
-- 1. Database
CREATE DATABASE IF NOT EXISTS `mysql_user_db` 
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mysql_user_db`;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `is_verified` BOOLEAN DEFAULT FALSE,
  `otp` VARCHAR(10) DEFAULT NULL,
  `otp_expires_at` DATETIME DEFAULT NULL,
  `otp_last_sent_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_is_verified` (`is_verified`)
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `category` VARCHAR(100) DEFAULT 'General',
  `stock` INT NOT NULL DEFAULT 0,
  `image_url` VARCHAR(500) NOT NULL,
  `image_filename` VARCHAR(255) DEFAULT NULL,
  `image_size` INT DEFAULT 0,
  `created_by` INT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_products_category` (`category`),
  INDEX `idx_products_created_by` (`created_by`),
  CONSTRAINT `fk_products_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
);
```

> **Note**: When MySQL is running, the server's `initDB()` in [config/db.js](file:///e:/Backend/mysql-user-project/config/db.js) will automatically create the database and tables on startup if they don't already exist!

---

## 🛠️ Configuration & Setup

1. **Install Dependencies**:
   ```bash
   cd e:\Backend\mysql-user-project
   npm install
   ```

2. **Configure Environment Variables (`.env`)**:
   Open [.env](file:///e:/Backend/mysql-user-project/.env) and update your MySQL credentials whenever you are ready:
   ```ini
   PORT=5006
   NODE_ENV=development

   # MySQL Database Credentials
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=mysql_user_db

   # JWT Secret
   JWT_SECRET=super_secret_jwt_key_mysql_user_2026
   JWT_EXPIRES_IN=7d

   # Nodemailer SMTP Configuration (Optional)
   # If left empty, OTP codes will be printed to server console and sent in debug response for instant testing
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=
   SMTP_PASS=
   EMAIL_FROM="MySQL User System" <noreply@mysqluser.com>

   # Cloudinary Image Storage
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_FOLDER=products
   MAX_FILE_SIZE=5242880
   ```

   Create a Cloudinary account and copy the cloud name, API key, and API secret from its dashboard into `.env`. Keep `.env` private and never commit or share the API secret. Multer receives the image in memory and sends it to Cloudinary; images are not saved in this project's `uploads` folder.

3. **Start the Server**:
   ```bash
   npm run dev
   # Or: node server.js
   ```

4. **Access the System**:
   - Web UI: [http://localhost:5006](http://localhost:5006)
   - Health & Docs: [http://localhost:5006/api/health](http://localhost:5006/api/health)
   - Product image URLs are served directly by Cloudinary and stored in the `image_url` column.

---

## 📡 API Endpoints Reference

### 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user & dispatch OTP email | No |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit OTP code & activate account | No |
| `POST` | `/api/auth/resend-otp` | Resend new OTP (with 60s cooldown) | No |
| `POST` | `/api/auth/login` | Login with email & password (only verified accounts) | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | **Yes (JWT)** |

### 2. Product Endpoints (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Fetch all products (supports `?search=`, `?category=`, `?page=`, `?limit=`) | No |
| `GET` | `/api/products/:id` | Fetch single product details with creator info | No |
| `POST` | `/api/products` | Create product with Multer-to-Cloudinary image upload | **Yes (JWT)** |
| `PUT` | `/api/products/:id` | Update product details & replace the Cloudinary image | **Yes (JWT)** |
| `DELETE` | `/api/products/:id` | Delete product & remove associated Cloudinary image | **Yes (JWT)** |

---

## 🧪 Automated Testing

Run the automated 11-step end-to-end integration test:
```bash
npm test
# Or: node test-api.js
```
