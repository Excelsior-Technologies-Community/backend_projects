# Role-Based Access Control (RBAC) & Subscription Payment Management System

A beginner-friendly, production-ready full-stack web application implementing Role-Based Access Control (RBAC), multi-tier user dashboards, and subscription payments using Razorpay in Test Mode.

---

## 🌟 Key Highlights & Features

- **Three Distinct User Roles**:
  - **Admin**: Full control over user accounts, role definitions, granular permissions, subscription plan creation/pricing, all payment transactions, and security activity audit logs.
  - **Manager**: Restricted desk to view and manage only assigned client records, ticket status progressions, team notes, and authorized management reports.
  - **Customer**: Self-service portal to browse plans, complete checkout via Razorpay Test Mode, track active subscription validity / countdown, and view/print official payment receipts and invoices.
- **Strict Backend Security & RBAC Enforcement**:
  - Passwords hashed with `bcryptjs`.
  - Stateless authentication via JSON Web Tokens (`JWT`).
  - Strict authorization middleware checking roles (`authorizeRoles`) and permissions (`authorizePermissions`).
  - Server-side manager record ownership enforcement preventing access to unauthorized records.
  - Automatic safeguard preventing accidental deactivation or role downgrading of the last active Admin.
  - Public registration strictly restricted to Customer role only (no privilege escalation).
- **Razorpay Test Mode Payment Gateway**:
  - Orders created server-side via official Razorpay Node.js SDK using integer paise for INR.
  - Cryptographic HMAC-SHA256 signature verification (`order_id|payment_id`).
  - Idempotent payment processing preventing duplicate subscriptions or double charges.
  - Raw body signature-verified Webhook endpoint (`/api/payments/webhook`).
  - Built-in interactive test checkout simulator to effortlessly test both verified success and failure flows without needing external live keys.
- **Invoices & Receipts**:
  - Auto-generated payment receipts with invoice reference numbers (`INV-XXXXXX-XXXX`).
  - Print / Save as PDF capability formatted for billing audits.
- **Activity & Security Audit Stream**:
  - Logs logins, logouts, role changes, plan modifications, and payment status events with actor, IP, and timestamp.

---

## 🏗️ Project Architecture & Folder Structure

```
role_base_access/
├── client/                     # Frontend (React.js + Vite + Tailwind CSS + Lucide React)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── src/
│       ├── api/                # API client with automatic JWT token injection
│       │   └── apiClient.js
│       ├── components/         # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── RazorpayModal.jsx
│       │   └── ReceiptModal.jsx
│       ├── context/            # React AuthContext state management
│       │   └── AuthContext.jsx
│       ├── layouts/            # Dashboard layout wrapper
│       │   └── DashboardLayout.jsx
│       ├── pages/              # Application views & pages
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── ManagerDashboard.jsx
│       │   ├── CustomerDashboard.jsx
│       │   ├── CustomerPlans.jsx
│       │   ├── PaymentHistory.jsx
│       │   ├── UserManagement.jsx
│       │   ├── RoleManagement.jsx
│       │   ├── PlanManagement.jsx
│       │   ├── TransactionManagement.jsx
│       │   ├── RecordManagement.jsx
│       │   ├── ActivityLogsPage.jsx
│       │   ├── Profile.jsx
│       │   └── NotFound.jsx
│       ├── App.jsx             # React Router routing configuration
│       ├── main.jsx
│       └── index.css
│
├── server/                     # Backend (Node.js + Express + Mongoose)
│   ├── config/
│   │   └── db.js               # MongoDB connection handler
│   ├── controllers/            # Controller logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── roleController.js
│   │   ├── planController.js
│   │   ├── paymentController.js
│   │   ├── subscriptionController.js
│   │   ├── transactionController.js
│   │   ├── recordController.js
│   │   └── activityLogController.js
│   ├── middleware/             # Auth & RBAC middlewares
│   │   ├── auth.js             # JWT verification & active account check
│   │   └── rbac.js             # Role & permission authorization
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Role.js
│   │   ├── Permission.js
│   │   ├── Plan.js
│   │   ├── Subscription.js
│   │   ├── Transaction.js
│   │   ├── Record.js
│   │   └── ActivityLog.js
│   ├── routes/                 # Express API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── roleRoutes.js
│   │   ├── planRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── subscriptionRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── recordRoutes.js
│   │   └── logRoutes.js
│   ├── scripts/
│   │   └── seed.js             # Initial database seed script
│   ├── utils/
│   │   └── logger.js           # Activity log helper
│   ├── .env                    # Local environment variables
│   ├── .env.example            # Environment template
│   ├── package.json
│   └── server.js               # Main Express entry point
│
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.x or v20.x+)
- **MongoDB** (Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

---

### Step 1: Backend Setup

1. Open a terminal in `server/`:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/rbac_subscription_db
   JWT_SECRET=super_secret_rbac_jwt_key_change_in_production_123456
   CLIENT_URL=http://localhost:5173

   # Razorpay Test Mode Credentials (Optional: if placeholder is used, test simulator activates)
   RAZORPAY_KEY_ID=rzp_test_placeholder_key_id
   RAZORPAY_KEY_SECRET=placeholder_secret_key_123
   RAZORPAY_WEBHOOK_SECRET=placeholder_webhook_secret_123
   ```

4. Run the Database Seed Script (Creates default permissions, roles, initial Admin account, Manager, Customer, and sample plans):
   ```bash
   npm run seed
   # or: node scripts/seed.js
   ```

5. Start the backend server:
   ```bash
   npm start
   # or for development auto-restart:
   npm run dev
   ```
   *The server starts on `http://localhost:5000`.*

---

### Step 2: Frontend Setup

1. Open a terminal in `client/`:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:5173`.*

---

## 🔑 Pre-Seeded Demo Accounts & Credentials

For fast review and demonstration, one-click demo login buttons are provided on the login page (`/login`):

| Role | Email Address | Password | Permissions & Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@rbac.com` | `Admin@12345` | Unrestricted superuser access to users, roles, plans, transactions, and audit logs. |
| **Manager** | `manager@rbac.com` | `Manager@12345` | Access to assigned customer records, notes, and progress reports. |
| **Customer** | `customer@rbac.com` | `Customer@12345` | Self-service plan subscription, Razorpay test checkout, invoice receipt downloads. |

*You can also register a new customer account directly from the register page.*

---

## 💳 Razorpay Test Mode Integration

### Development / Local Test Simulator
The portal includes a test checkout simulator. If you run the project without registering for a Razorpay account, clicking **"Subscribe with Razorpay"** will launch the test checkout modal with one-click **"Simulate Successful Payment"** and **"Simulate Failure"** actions. It triggers the exact backend signature verification and subscription activation pipeline.

### Using Real Razorpay Test API Keys
To use your official Razorpay Test Mode keys:
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/) and switch to **Test Mode**.
2. Go to **Settings > API Keys** and generate a Key ID and Key Secret.
3. Replace the values in `server/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_your_real_key_id
   RAZORPAY_KEY_SECRET=your_real_key_secret
   ```
4. Restart the backend server. The checkout will now open the native Razorpay test modal with UPI, Netbanking, and Test Cards.

---

## 📡 API Endpoint Reference

### Authentication
- `POST /api/auth/register` — Public customer registration (strictly assigns Customer role)
- `POST /api/auth/login` — Authenticate and receive JWT
- `GET /api/auth/me` — Get current authenticated user profile
- `PUT /api/auth/profile` — Update name or reset password
- `POST /api/auth/logout` — Logout and record activity log

### User Management (Admin Only)
- `GET /api/users` — Search and filter users by role and status
- `POST /api/users` — Create user and assign initial role
- `GET /api/users/:id` — Get user profile details
- `PUT /api/users/:id` — Update user details or reassign role
- `PATCH /api/users/:id/status` — Deactivate / activate user (protected against deactivating last admin)
- `GET /api/users/managers` — Get list of managers for assignment

### Roles & Permissions (Admin Only)
- `GET /api/roles` — View roles with assigned user count
- `POST /api/roles` — Create new custom role
- `PUT /api/roles/:id` — Update role details and permission matrix
- `DELETE /api/roles/:id` — Delete custom role (system roles protected)
- `GET /api/roles/permissions` — List all 10 system permissions

### Subscription Plans
- `GET /api/plans` — Public / Customer: List active subscription plans
- `GET /api/plans/admin` — Admin: List all plans including inactive
- `POST /api/plans` — Admin: Create new plan
- `PUT /api/plans/:id` — Admin: Update plan pricing, duration, or features
- `PATCH /api/plans/:id/status` — Admin: Toggle plan active status

### Payments & Razorpay
- `GET /api/payments/config` — Get public Razorpay Key ID
- `POST /api/payments/create-order` — Create Razorpay order (integer paise in INR)
- `POST /api/payments/verify` — Verify HMAC-SHA256 signature and idempotently activate subscription
- `POST /api/payments/webhook` — Razorpay webhook endpoint with raw body signature check

### Subscriptions & Transactions
- `GET /api/subscriptions/my` — Customer: View current subscription and validity countdown
- `GET /api/subscriptions/admin` — Admin: List all system subscriptions
- `GET /api/transactions/my` — Customer: View personal payment transaction history
- `GET /api/transactions` — Admin: View, search, and filter all system transactions
- `GET /api/transactions/:id/receipt` — View verified printable payment receipt and invoice

### Client Records (Manager & Admin)
- `GET /api/records` — Manager: View assigned records; Admin: View all records
- `POST /api/records` — Admin: Create and assign client record
- `GET /api/records/:id` — View record (strict manager ownership check)
- `PUT /api/records/:id` — Update status or append manager work note

### Activity Logs & Analytics
- `GET /api/logs/stats` — Role-aware dashboard statistics (revenue, users, tickets)
- `GET /api/logs` — Admin: Searchable security audit event stream

---

## 🛡️ Testing & Security Checklist Verified

- [x] **RBAC Isolation**: Customer role cannot access Admin or Manager API routes (returns 403 Forbidden).
- [x] **Manager Record Privacy**: Managers cannot query or update tickets not allocated to their manager ID.
- [x] **Customer Privacy**: Customers can only view their own transactions, subscriptions, and receipts.
- [x] **Privilege Escalation Protection**: Public register endpoint ignores any client-supplied role and strictly assigns `Customer`.
- [x] **Last Admin Safeguard**: Attempting to deactivate or demote the last active Admin account is blocked with a descriptive error.
- [x] **Signature Verification**: Payment verification requires cryptographic HMAC verification against the secret key.
- [x] **Idempotent Billing**: Duplicate payment verification requests for the same order do not create duplicate subscriptions.
- [x] **Automated Receipts**: Only captured and verified payments can generate receipts.
- [x] **Input Validation**: Forms validate email format, password minimum lengths, and required fields.

---

## 📄 License
This project is open-source and created for portfolio demonstration and educational evaluation.
