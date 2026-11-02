# Personal Trainer E-Commerce & Coaching Web Platform
Replication & Expansion of [Personal Trainer Shopify Theme](https://personaltrainer-workdo.myshopify.com/)

A full-stack, responsive platform with a complete **Admin Panel** and rich **User Storefront** for gym equipment, nutrition supplements, workout programs, and VIP coaching subscriptions.

---

## ⚡ Quick Start Guide

### 1. Backend Server (Express + REST API + Database)
- **Directory**: `d:/excelsior/backend/personal_trainer`
- **Port**: `http://localhost:5000`
- **Start Command**: `node server/index.js`

### 2. Frontend Client (Vite + React + Dark Gym Aesthetics)
- **Directory**: `d:/excelsior/backend/personal_trainer/client`
- **Port**: `http://localhost:3000`
- **Start Command**: `npm run dev`

---

## 🔑 Demo Credentials (1-Click Fill in Modal)

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin Coach** | `admin@trainer.com` | `admin123` | Full Admin Console, Product CRUD, Categories, Memberships, Orders, Users |
| **Customer Athlete** | `user@trainer.com` | `user123` | Cart, Wishlist, Checkout, Membership passes, Profile orders, Reviews |

---

## 🛡️ Admin Panel Features
- **Admin Authentication**: JWT + Bcrypt secured access.
- **Interactive Dashboard**: Real-time revenue metrics, total orders, active VIP subscriptions, registered athlete accounts, and recent purchases table.
- **Product CRUD**: Create, edit, delete equipment & supplements, price/compare price, inventory stock, images, specifications, and bestseller badges.
- **Category CRUD**: Manage store departments (Workout Equipment, Supplements, Apparel, Training Programs, Accessories) with dynamic item counting.
- **Membership Plan CRUD**: Manage athletic tiers (Starter Pass, Pro Athlete, VIP 1-on-1 Coaching), pricing, billing intervals, and perk checklists.
- **Order Pipeline Management**: Real-time fulfillment status updates (`Processing` ➔ `Shipped` ➔ `Delivered` ➔ `Cancelled`) and customer tracking references.
- **User Management**: Athlete directory with role switching (`admin` / `user`) and subscription status tracker.

---

## 🏋️‍♂️ User Storefront Features
- **Hero & Athlete Showcase**: Sleek dark gym aesthetic (obsidian `#0a0c10`, electric lime `#a3e635`, glassmorphism), trust metrics, and Coach Marcus introduction.
- **Shop & Faceted Filters**: Real-time search, category filtering, price sliders, and sort options (low/high price, top rated).
- **Rich Product Detail**: Multi-image gallery, stock indicator, quantity adjuster, specs table, and athlete review submissions.
- **Cart & Fast Checkout**: Promo code engine (Try `COACH20` for 20% discount), shipping address capture, payment method simulator, and instant invoice screen.
- **Wishlist**: 1-click wishlist toggle with instant "Move to Cart".
- **Membership Tiers**: Plan comparison cards with direct 1-click subscription activation.
- **Athlete Account**: Real-time order tracking with item breakdowns and active coaching status.
- **About & Contact**: Coach Marcus story, philosophy pillars, location map details, and direct messaging form.
