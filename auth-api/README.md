# 🔐 Authentication System REST API (Level 2 - Intermediate)

A secure, modular, intermediate-level Node.js and Express Authentication REST API with MongoDB, password hashing (`bcryptjs`), and JSON Web Tokens (`jsonwebtoken`).

---

## 🚀 Features

- **User Registration**: `POST /api/auth/register` with email validation, unique constraint, and password hashing (`bcryptjs` with salt).
- **User Login**: `POST /api/auth/login` validating credentials and returning a signed JWT token.
- **Protected Profile Route**: `GET /api/auth/profile` and `GET /api/profile` secured with Bearer token authentication middleware.
- **Intermediate Architecture**: Modular MVC structure (`config/`, `models/`, `controllers/`, `routes/`, `middleware/`).
- **Security Best Practices**:
  - Passwords are never stored in plain text.
  - Password hashes are excluded from JSON responses (`user.toJSON()` / Mongoose projections).
  - Centralized error handler and 404 route handling.
  - Environment variable configuration via `dotenv`.

---

## 📁 Project Structure

```
auth-api/
├── config/
│   └── db.js                 # MongoDB connection using Mongoose
├── controllers/
│   └── authController.js     # Auth logic (register, login, getProfile)
├── middleware/
│   ├── authMiddleware.js     # JWT Bearer token verification middleware
│   └── errorMiddleware.js    # 404 Not Found & Centralized Error Handler
├── models/
│   └── User.js               # User Schema with pre-save bcrypt hashing
├── routes/
│   └── authRoutes.js         # Express router for /api/auth endpoints
├── .env                      # Environment configurations
├── .env.example              # Sample environment template
├── package.json              # Project dependencies & scripts
├── server.js                 # Express server initialization
├── test.js                   # Automated end-to-end test suite
└── README.md                 # Project documentation
```

---

## ⚙️ Installation & Setup

1. **Navigate to project directory**:
   ```bash
   cd e:\Backend\auth-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Check `.env`:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/auth_system_db
   JWT_SECRET=supersecretkey_auth_api_2026_jwt_token
   JWT_EXPIRES_IN=1d
   ```

4. **Start the server**:
   - For development (with nodemon):
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

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | API status and overview |
| `POST` | `/api/auth/register` | Public | Register new user and receive JWT |
| `POST` | `/api/auth/login` | Public | Login with email & password, receive JWT |
| `GET` | `/api/auth/profile` | Protected | Get authenticated user profile |
| `GET` | `/api/profile` | Protected | Direct alias for user profile |

---

## 🧪 Testing with cURL / Postman

### 1. Register User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"password\":\"secret123\"}"
```

### 2. Login User
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"alice@example.com\",\"password\":\"secret123\"}"
```

### 3. Access Protected Profile
```bash
curl -X GET http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```
