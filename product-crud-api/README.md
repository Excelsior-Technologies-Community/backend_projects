# 📦 Product CRUD REST API (with MongoDB & Pagination)

A beginner-friendly RESTful API built with **Node.js**, **Express**, and **MongoDB (Mongoose)** for managing products with built-in pagination.

Part of **Level 1 — Beginner** backend training projects.

---

## 🚀 Features

- Full **CRUD** operations: Create, Read, Update, Delete
- **MongoDB** integration with Mongoose ODM
- **Pagination** support using `?page=1&limit=5`
- Optional search filter: `?search=keyboard`
- Input validation with clear error responses
- RESTful HTTP status codes (`200`, `201`, `400`, `404`, `500`)

---

## 📂 Project Structure

```text
product-crud-api/
├── models/
│   └── Product.js       # Mongoose schema for Product (name, price, stock)
├── node_modules/
├── package.json
├── server.js            # Express server and API routes
├── test.js              # Automated verification script
└── README.md            # Documentation
```

---

## 📋 Product Schema

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | Product name (trimmed) |
| `price` | Number | Yes | Product price (minimum 0) |
| `stock` | Number | Yes | Available stock quantity (minimum 0, default 0) |
| `createdAt` | Date | Auto | Creation timestamp |

---

## 🛠️ API Endpoints

| Method | Endpoint | Description | Query / Body Params |
|---|---|---|---|
| `GET` | `/` | API Welcome & endpoints documentation | None |
| `GET` | `/api/products` | Get products with pagination & search | `?page=1&limit=5&search=keyword` |
| `GET` | `/api/products/:id` | Get a single product by ID | MongoDB `_id` |
| `POST` | `/api/products` | Create a new product | `{ "name": "Laptop", "price": 999.99, "stock": 10 }` |
| `PUT` | `/api/products/:id` | Update product details | `{ "name"?, "price"?, "stock"? }` |
| `DELETE` | `/api/products/:id` | Delete product by ID | MongoDB `_id` |

---

## 🧪 Testing the API

### 1. Run Automated Test Script
```bash
node test.js
```

### 2. Start the Server
```bash
npm start
# or for live reloading:
npm run dev
```

The server will run on `http://localhost:3000`.

---

## 📝 Example Requests & Responses

### 1. Create a Product
**POST** `http://localhost:3000/api/products`
```json
{
  "name": "Wireless Mechanical Keyboard",
  "price": 89.99,
  "stock": 25
}
```
**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "6648a1b2c3d4e5f678901234",
    "name": "Wireless Mechanical Keyboard",
    "price": 89.99,
    "stock": 25,
    "createdAt": "2026-09-17T11:00:00.000Z"
  }
}
```

### 2. Get Products with Pagination
**GET** `http://localhost:3000/api/products?page=1&limit=2`

**Response (`200 OK`):**
```json
{
  "success": true,
  "count": 2,
  "total": 15,
  "page": 1,
  "totalPages": 8,
  "limit": 2,
  "data": [
    {
      "_id": "6648a1b2c3d4e5f678901234",
      "name": "Wireless Mechanical Keyboard",
      "price": 89.99,
      "stock": 25
    },
    {
      "_id": "6648a1b2c3d4e5f678901235",
      "name": "Ergonomic Mouse",
      "price": 49.99,
      "stock": 40
    }
  ]
}
```
