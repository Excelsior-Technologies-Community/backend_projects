# 📝 Blog REST API with Authentication (Level 2 - Intermediate)

An intermediate-level Node.js, Express, and MongoDB REST API implementing full User Authentication and a Blog Post system with **strict Author-Only permissions** (only the author of a post can edit or delete it).

---

## 🚀 Key Features

- **Authentication System**:
  - `POST /api/auth/register`: Create author account with hashed password (`bcryptjs`).
  - `POST /api/auth/login`: Authenticate and receive JWT token (`jsonwebtoken`).
  - `GET /api/auth/profile`: View logged-in author profile.
- **Blog Post CRUD**:
  - `GET /api/posts`: Public endpoint to view all posts (supports search, author filter, pagination).
  - `GET /api/posts/:id`: Public endpoint to view a single post with author details.
  - `POST /api/posts`: Protected endpoint to publish a new post (automatically sets author to logged-in user).
  - `PUT /api/posts/:id`: **Author-Only Protected**. Verifies that `post.author === req.user._id`. Returns `403 Forbidden` if another user attempts to edit!
  - `DELETE /api/posts/:id`: **Author-Only Protected**. Verifies that `post.author === req.user._id`. Returns `403 Forbidden` if another user attempts to delete!
- **Intermediate MVC Architecture**:
  - Decoupled `models/`, `controllers/`, `routes/`, `middleware/`, `config/`.
  - Population of author details via Mongoose (`populate("author", "name email")`).
  - Global error handling and validation.

---

## 📁 Project Structure

```
blog-api/
├── config/
│   └── db.js                 # MongoDB connection using Mongoose
├── controllers/
│   ├── authController.js     # Auth logic (register, login, getProfile)
│   └── postController.js     # Post CRUD & author authorization checks
├── middleware/
│   ├── authMiddleware.js     # JWT Bearer token authentication
│   └── errorMiddleware.js    # 404 & Centralized error handling
├── models/
│   ├── User.js               # User Schema with bcrypt password hashing
│   └── Post.js               # Post Schema referencing User as author
├── routes/
│   ├── authRoutes.js         # /api/auth router
│   └── postRoutes.js         # /api/posts router
├── .env                      # Environment configurations
├── .env.example              # Sample environment template
├── package.json              # Project dependencies & scripts
├── server.js                 # Express server entry point
├── test.js                   # Automated test suite verifying author ownership
└── README.md                 # Documentation & API reference
```

---

## ⚙️ Installation & Setup

1. **Navigate to project directory**:
   ```bash
   cd e:\Backend\blog-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Check `.env`:
   ```env
   PORT=5002
   MONGO_URI=mongodb://localhost:27017/blog_api_db
   JWT_SECRET=supersecretkey_blog_api_2026_jwt_token
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

### 🔐 Authentication Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user / author |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `GET` | `/api/auth/profile` | Protected | Get authenticated author profile |

### 📝 Blog Posts Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Public | Get all posts (Query: `?page=1&limit=10&search=nodejs&author=<userId>`) |
| `GET` | `/api/posts/:id` | Public | Get single post by ID with author details |
| `POST` | `/api/posts` | Protected | Create new post (Body: `{ title, content, tags }`) |
| `PUT` | `/api/posts/:id` | **Author Only** | Update post (Returns `403 Forbidden` if not post author) |
| `DELETE` | `/api/posts/:id` | **Author Only** | Delete post (Returns `403 Forbidden` if not post author) |

---

## 🧪 Testing with cURL / Postman

### 1. Register Author
```bash
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"password\":\"secret123\"}"
```

### 2. Login to obtain JWT
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"alice@example.com\",\"password\":\"secret123\"}"
```

### 3. Create a Post
```bash
curl -X POST http://localhost:5002/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ALICE_JWT_TOKEN>" \
  -d "{\"title\":\"My First Blog Post\",\"content\":\"Welcome to my backend journey!\",\"tags\":[\"intro\"]}"
```

### 4. Attempt to Edit Post with Another User's Token (403 Forbidden)
```bash
curl -X PUT http://localhost:5002/api/posts/<POST_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <BOB_JWT_TOKEN>" \
  -d "{\"title\":\"Unauthorized edit\"}"
```
*Response: `403 Forbidden: You are not authorized to edit this post. Only the author can edit their own post.`*

### 5. Edit Post as the Author (200 OK)
```bash
curl -X PUT http://localhost:5002/api/posts/<POST_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ALICE_JWT_TOKEN>" \
  -d "{\"title\":\"My Updated Blog Post\"}"
```
