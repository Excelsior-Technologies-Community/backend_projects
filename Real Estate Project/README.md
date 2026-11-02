# Real Estate Management Platform (Realestate WorkDo)

A full-stack luxury real estate platform built with React, Node.js/Express, MySQL, Stored Procedures, and automated dual Nodemailer email dispatch for both clients and administrators.

Reference Design: [Realestate WorkDo](https://realestate-workdo.myshopify.com/)

---

## 🌟 Architecture & Technology Stack

| Layer | Technologies & Key Libraries | Description |
|---|---|---|
| **Frontend Portal** | React 19, Vite, Tailwind CSS, React Router 7, Lucide Icons, Swiper | Customer website matching the reference theme with listings, filters, property details, and viewing booking. |
| **Admin Panel** | React 19, Vite, Tailwind CSS, React Router 7, Axios, Lucide Icons | Full administration dashboard with live KPI metrics, leads management, listings CRUD, taxonomy, and settings. |
| **Backend API** | Node.js, Express 5, MySQL2, Stored Procedures, Nodemailer, JWT, Multer | Centralized REST API executing MySQL Stored Procedures, authentication, and dual email dispatch. |
| **Database** | MySQL 8.0+ (`realestate_db`) | 14 relational tables + 10 MySQL Stored Procedures for high performance. |

---

## 🔑 Default Credentials

### Administrator Account
* **URL**: [http://localhost:5175/admin/login](http://localhost:5175/admin/login) *(or port 5174)*
* **Email**: `admin@realestate.com`
* **Password**: `admin123`
*(Note: A one-click "Fill Demo Admin Credentials" button is provided on the login page)*

### Demo Customer Account
* **Email**: `user@realestate.com`
* **Password**: `user123`

---

## 📬 Automated Email Service (Dual Dispatch)

Implemented in [`backend/services/emailService.js`](file:///e:/Real%20Estate%20Project/backend/services/emailService.js) using Nodemailer and Gmail SMTP:

1. **User Welcome Email**: Dispatched automatically upon customer registration with account details and onboarding tips.
2. **User Inquiry Confirmation**: Dispatched automatically to the client when they submit a viewing request on any property detail page.
3. **Admin Hot Lead Alert**: Dispatched immediately to `ADMIN_EMAIL` (`bannajiofficial05@gmail.com`) containing client contact information, property target, and viewing notes.
4. **Password Reset Email**: Dispatched with secure token link for account recovery.
5. **Live Verification Test Tool**: Interactive email test utility located in the Admin Panel Settings page (`/admin/settings`).

---

## 🗄️ MySQL Stored Procedures Included

The database schema and stored procedures are in [`backend/database/schema_and_procedures.sql`](file:///e:/Real%20Estate%20Project/backend/database/schema_and_procedures.sql):

* `sp_get_dashboard_stats()`: Aggregates properties, active listings, total inquiries, new leads, and user counts in a single call.
* `sp_get_properties(category_id, location_id, purpose, min_price, max_price, search, sort, limit, offset)`: High performance filtered and sorted property retrieval.
* `sp_get_property_by_id(id)`: Fetches property details, multiple gallery images, and linked amenity fixtures.
* `sp_create_property(...)`: Creates property and initializes primary image.
* `sp_update_property(...)`: Full updates to property specifications.
* `sp_delete_property(id)`: Cascading removal of listings and associated records.
* `sp_create_inquiry(property_id, name, email, phone, message)`: Records customer lead and joins target property title & pricing.
* `sp_toggle_favorite(user_id, property_id)`: Atomically adds or removes property from customer watchlist.
* `sp_get_user_favorites(user_id)`: Retrieves customer's favorited residences.
* `sp_save_setting(key, value)`: Upserts platform configuration settings.

---

## 🚀 Running the Services Locally

### 1. Database Initialization
```bash
cd backend
node database/init_db.js
```

### 2. Start Backend API Server (Port 5000)
```bash
cd backend
npm run dev
```

### 3. Start Frontend Customer Portal (Port 5173)
```bash
cd frontend
npm run dev
```
Accessible at: [http://localhost:5173](http://localhost:5173)

### 4. Start Admin Dashboard (Port 5174 / 5175)
```bash
cd admin
npm run dev
```
Accessible at: [http://localhost:5175/admin](http://localhost:5175/admin)
