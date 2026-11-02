# 📝 Notes REST API (Level 2 - Intermediate)

A secure, intermediate-level Node.js and Express REST API featuring **private user notes**, **search by title**, and **filter by date** using JWT authentication and MongoDB.

---

## 🚀 Key Features

- **Private Notes per User**: Notes are strictly owned by and visible only to the authenticated user who created them.
- **Search by Title**: Case-insensitive substring search (`?search=keyword` or `?title=keyword`).
- **Filter by Date**: Filter by single date (`?date=YYYY-MM-DD`) or date range (`?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`).
- **JWT Authentication**: Full registration, login, and token verification.
- **Intermediate MVC Architecture**: Clean separation of `models/`, `controllers/`, `routes/`, `middleware/`, and `config/`.

---

## 📁 Project Structure

```
notes-api/
├── config/
│   └── db.js                 # MongoDB connection using Mongoose
├── controllers/
│   ├── authController.js     # User registration & login logic
│   └── noteController.js     # Note CRUD, title search & date filtering
├── middleware/
│   ├── authMiddleware.js     # JWT Bearer token verification
│   └── errorMiddleware.js    # 404 & Centralized error handler
├── models/
│   ├── User.js               # User Schema with bcrypt password hashing
│   └── Note.js               # Note Schema with compound index
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   └── noteRoutes.js         # /api/notes routes (all protected)
├── .env                      # Environment configurations
├── .env.example              # Sample environment template
├── package.json              # Project dependencies & scripts
├── server.js                 # Express server initialization
├── test.js                   # Automated test suite
└── README.md                 # Complete documentation
```

---

## ⚙️ Installation & Setup

1. **Navigate to project directory**:
   ```bash
   cd e:\Backend\notes-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Check `.env`:
   ```env
   PORT=5003
   MONGO_URI=mongodb://localhost:27017/notes_api_db
   JWT_SECRET=supersecretkey_notes_api_2026_jwt_token
   JWT_EXPIRES_IN=1d
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

### 🔐 Authentication

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/auth/profile` | Protected | View user profile |

### 📝 Notes (Private & Protected)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notes` | Protected | Get all private notes (Query: `?search=...`, `?date=YYYY-MM-DD`, `?startDate=...&endDate=...`) |
| `GET` | `/api/notes/:id` | Protected | Get single private note by ID |
| `POST` | `/api/notes` | Protected | Create private note (Body: `{ title, content, category }`) |
| `PUT` | `/api/notes/:id` | Protected | Update private note (Only note owner) |
| `DELETE` | `/api/notes/:id` | Protected | Delete private note (Only note owner) |

---

## 🧪 Testing with cURL / Postman

### 1. Register User
```bash
curl -X POST http://localhost:5003/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice\",\"email\":\"alice@notes.com\",\"password\":\"secret123\"}"
```

### 2. Create Note
```bash
curl -X POST http://localhost:5003/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d "{\"title\":\"Meeting Notes\",\"content\":\"Discuss Q3 goals\",\"category\":\"Work\"}"
```

### 3. Search Notes by Title
```bash
curl -X GET "http://localhost:5003/api/notes?search=Meeting" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### 4. Filter Notes by Date
```bash
curl -X GET "http://localhost:5003/api/notes?date=2026-09-21" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```
