# Student CRUD REST API (MongoDB + Express)

A simple, beginner-friendly REST API for managing Student records with **Express** and **MongoDB** (using Mongoose). No frontend, pure backend API just like `todo-mongo-api` and `calculator-api`.

---

## 📋 Features

- **Full CRUD operations**:
  - **C**reate: Add student (`name`, `roll`, `marks`, `grade`)
  - **R**ead: Get all students (with optional grade filter) or a single student by ID
  - **U**pdate: Edit student information (name, roll, marks, grade)
  - **D**elete: Remove student by ID
- **Unique Roll Number Validation**: Prevents duplicate student entries.
- **Auto Grade Calculation**: Automatically calculates `grade` from `marks` if not explicitly supplied (`>=90`: A+, `>=80`: A, `>=70`: B, `>=60`: C, `>=50`: D, `<50`: F).
- **Self-contained Verification Script**: Run `npm test` to test all MongoDB CRUD operations in terminal without needing Postman.

---

## 🗄️ Student Schema

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | Student's full name |
| `roll` | Number | Yes (Unique) | Unique roll number |
| `marks` | Number | Yes | Student's marks (0 - 100) |
| `grade` | String | No | Grade (Auto-calculated if omitted) |
| `createdAt` | Date | No | Timestamp of creation |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** installed (v16+)
- **MongoDB** running locally on port `27017` (e.g., `mongodb://localhost:27017/studentDB`)

### 2. Install Dependencies
```bash
cd student-crud-api
npm install
```

### 3. Run Automated Tests
Verify your MongoDB connection and CRUD operations:
```bash
npm test
```

### 4. Start the Server
```bash
npm start
```
The server will run on `http://localhost:3000`.

---

## 🌐 API Endpoints

### 1. Welcome / Endpoints List
- **Method:** `GET`
- **URL:** `http://localhost:3000/`

---

### 2. Create Student
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/students`
- **Body (JSON):**
```json
{
  "name": "Rahul Sharma",
  "roll": 101,
  "marks": 88
}
```
*(Notice `grade` is optional; it will be automatically computed as `"A"`!)*

---

### 3. Get All Students
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/students`
- **Optional Filter by Grade:** `http://localhost:3000/api/students?grade=A`

---

### 4. Get Student by ID
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/students/<STUDENT_ID>`

---

### 5. Update Student
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/students/<STUDENT_ID>`
- **Body (JSON):**
```json
{
  "marks": 95
}
```
*(Updating marks automatically updates the grade to `"A+"`!)*

---

### 6. Delete Student
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/students/<STUDENT_ID>`

---

## 💻 Testing with PowerShell

If you don't have Postman, you can test directly in Windows PowerShell:

```powershell
# 1. Add student
Invoke-RestMethod -Uri "http://localhost:3000/api/students" -Method Post -ContentType "application/json" -Body '{"name":"Rahul Sharma","roll":101,"marks":88}'

# 2. Get all students
Invoke-RestMethod -Uri "http://localhost:3000/api/students" -Method Get
```
