# 🧮 Beginner Calculator API (Node.js + Express + MongoDB)

A beginner-friendly REST API for performing arithmetic operations (**Add**, **Subtract**, **Multiply**, **Divide**) using **Express** and **MongoDB** (via Mongoose), without any frontend.

Structured identically to `todo-mongo-api` following the Level 1 Backend Intern Training Guide.

---

## 🚀 Quick Start

### 1. Make sure MongoDB is running
Make sure your MongoDB server is active on `mongodb://localhost:27017/` (or run without MongoDB; the server automatically falls back to in-memory history).

### 2. Start the API Server
```bash
cd calculator-api
npm start
```
The server will start on `http://localhost:3000`.

### 3. Run Automated Tests
```bash
npm test
```

---

## 📡 API Endpoints Overview

All arithmetic operations are performed via **`GET`** requests. Both **query parameters** (`?num1=X&num2=Y`) and **path parameters** (`/:num1/:num2`) are supported.

| Method | Endpoint | Description | Query / Path Parameters |
|---|---|---|---|
| `GET` | `/` | Home route - API directory & documentation | None |
| `GET` | `/api/add` | **Add two numbers** | `?num1=10&num2=5` or `/10/5` |
| `GET` | `/api/subtract` | **Subtract num2 from num1** | `?num1=20&num2=8` or `/20/8` |
| `GET` | `/api/multiply` | **Multiply two numbers** | `?num1=6&num2=7` or `/6/7` |
| `GET` | `/api/divide` | **Divide num1 by num2** | `?num1=50&num2=2` or `/50/2` |
| `GET` | `/api/calculate` | Universal calculate endpoint | `?operation=add&num1=10&num2=5` |
| `GET` | `/api/history` | Get calculation history from database | `?limit=20` (Optional) |
| `DELETE`| `/api/history` | Clear calculation history | None |

> [!NOTE]
> Parameter aliases are also accepted: `?a=10&b=5` works interchangeably with `?num1=10&num2=5`.

---

## 🧪 Testing with cURL / Postman / Browser

### 1. Home / Documentation Route (`GET /`)
```bash
curl http://localhost:3000/
```

**Response (200 OK):**
```json
{
  "message": "Welcome to the Beginner Calculator REST API connected to MongoDB!",
  "database": "MongoDB connected",
  "endpoints": {
    "GET /api/add?num1=10&num2=5": "Add two numbers (also supports /api/add/10/5)",
    "GET /api/subtract?num1=10&num2=5": "Subtract num2 from num1 (also supports /api/subtract/10/5)",
    "GET /api/multiply?num1=10&num2=5": "Multiply two numbers (also supports /api/multiply/10/5)",
    "GET /api/divide?num1=10&num2=5": "Divide num1 by num2 (also supports /api/divide/10/5)",
    "GET /api/calculate?operation=add&num1=10&num2=5": "Universal calculation endpoint",
    "GET /api/history": "Get calculation history from database",
    "DELETE /api/history": "Clear calculation history"
  }
}
```

---

### 2. Add Two Numbers (`GET /api/add`)
```bash
curl "http://localhost:3000/api/add?num1=25&num2=15"
```

**Response (200 OK):**
```json
{
  "success": true,
  "operation": "add",
  "num1": 25,
  "num2": 15,
  "result": 40,
  "expression": "25 + 15 = 40"
}
```

Or using path parameters:
```bash
curl http://localhost:3000/api/add/25/15
```

---

### 3. Subtract Two Numbers (`GET /api/subtract`)
```bash
curl "http://localhost:3000/api/subtract?num1=50&num2=18"
```

**Response (200 OK):**
```json
{
  "success": true,
  "operation": "subtract",
  "num1": 50,
  "num2": 18,
  "result": 32,
  "expression": "50 - 18 = 32"
}
```

---

### 4. Multiply Two Numbers (`GET /api/multiply`)
```bash
curl "http://localhost:3000/api/multiply?num1=12&num2=8"
```

**Response (200 OK):**
```json
{
  "success": true,
  "operation": "multiply",
  "num1": 12,
  "num2": 8,
  "result": 96,
  "expression": "12 × 8 = 96"
}
```

---

### 5. Divide Two Numbers (`GET /api/divide`)
```bash
curl "http://localhost:3000/api/divide?num1=100&num2=4"
```

**Response (200 OK):**
```json
{
  "success": true,
  "operation": "divide",
  "num1": 100,
  "num2": 4,
  "result": 25,
  "expression": "100 ÷ 4 = 25"
}
```

---

### 6. Error Handling: Division by Zero (`GET /api/divide`)
```bash
curl "http://localhost:3000/api/divide?num1=50&num2=0"
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Division by zero is not allowed. Second number (num2) cannot be 0."
}
```

---

### 7. Error Handling: Missing or Invalid Input
```bash
curl "http://localhost:3000/api/add?num1=10"
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Second number is required. Provide 'num2' (or 'b') as a query parameter or path parameter."
}
```

---

### 8. View Calculation History (`GET /api/history`)
```bash
curl http://localhost:3000/api/history
```

**Response (200 OK):**
```json
{
  "success": true,
  "source": "MongoDB",
  "count": 4,
  "data": [
    {
      "_id": "66e1b7c4a10f8b001ef12345",
      "operation": "divide",
      "num1": 100,
      "num2": 4,
      "result": 25,
      "expression": "100 ÷ 4 = 25",
      "createdAt": "2026-09-11T12:00:00.000Z"
    }
  ]
}
```

---

### 9. Clear History (`DELETE /api/history`)
```bash
curl -X DELETE http://localhost:3000/api/history
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Calculation history cleared successfully from MongoDB (4 records deleted)."
}
```

---

## 📁 Project Structure

```
calculator-api/
├── models/
│   └── Calculation.js   # Mongoose Schema & Model for calculation history
├── server.js            # Express app, REST GET routes, validation & MongoDB connection
├── test.js              # Automated verification test script
├── package.json         # Project metadata and dependencies
└── README.md            # API documentation & guide
```
