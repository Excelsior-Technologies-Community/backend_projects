# 📝 Beginner Todo List API (Node.js + Express + MongoDB)

A beginner-friendly REST API for managing Todos using **Express** and **MongoDB** (via Mongoose), without any frontend.

---

## 🚀 Quick Start

### 1. Make sure MongoDB is running
Make sure your MongoDB server is active on `mongodb://localhost:27017/`.

### 2. Start the API Server
```bash
cd todo-mongo-api
npm start
```
The server will start on `http://localhost:3000`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Request Body (JSON) |
|---|---|---|---|
| `GET` | `/api/todos` | Get all todos from MongoDB | None |
| `GET` | `/api/todos/:id` | Get a specific todo by ID | None |
| `POST` | `/api/todos` | **Add a new todo** | `{"title": "...", "description": "..."}` |
| `DELETE` | `/api/todos/:id` | **Delete a todo by ID** | None |
| `PUT` | `/api/todos/:id` | Update todo details | `{"title": "...", "completed": true}` |
| `PATCH` | `/api/todos/:id/toggle` | Toggle completed status | None |

---

## 🧪 Testing with cURL / Postman / Thunder Client

### 1. Add (Create) a Todo (`POST /api/todos`)
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn MongoDB", "description": "Practice CRUD operations"}'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Todo created successfully!",
  "data": {
    "_id": "65e4f1a23b9c456789012345",
    "title": "Learn MongoDB",
    "description": "Practice CRUD operations",
    "completed": false,
    "createdAt": "2026-09-03T11:10:00.000Z"
  }
}
```

---

### 2. Get All Todos (`GET /api/todos`)
```bash
curl http://localhost:3000/api/todos
```

---

### 3. Delete a Todo (`DELETE /api/todos/:id`)
Replace `<TODO_ID>` with the actual `_id` from MongoDB:
```bash
curl -X DELETE http://localhost:3000/api/todos/<TODO_ID>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo deleted successfully!",
  "data": {
    "_id": "65e4f1a23b9c456789012345",
    "title": "Learn MongoDB",
    "description": "Practice CRUD operations",
    "completed": false
  }
}
```

---

### 4. Toggle Completion (`PATCH /api/todos/:id/toggle`)
```bash
curl -X PATCH http://localhost:3000/api/todos/<TODO_ID>/toggle
```

---

## 📁 Project Structure

```
todo-mongo-api/
├── models/
│   └── Todo.js      # Mongoose Schema & Model for Todo
├── server.js        # Express app, MongoDB connection & REST routes
├── test.js          # Automated database test script
├── package.json     # Project configuration and dependencies
└── README.md        # Documentation & API reference
```
