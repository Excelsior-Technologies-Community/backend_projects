# Implementation Plan: Personal Trainer E-Commerce & Admin Platform

Replicating and expanding upon the [Personal Trainer Shopify Theme](https://personaltrainer-workdo.myshopify.com/) with a rich full-stack architecture:

## 1. Architecture
- **Backend**: Node.js + Express + SQLite (via `better-sqlite3` or `sqlite3`) with auto-migration & rich sample seed data (gym gear, supplements, workout plans, memberships, coaching trainers).
- **Authentication & Roles**: JWT authentication + Bcrypt, supporting both **Admin** (`admin@trainer.com` / `admin123`) and **Customers / Users** (`user@trainer.com` / `user123`), with token-based access control.
- **Frontend**: Vite + React + Lucide Icons + Rich Vanilla CSS (dark athletic gym theme: sleek obsidian, electric neon/lime highlights, glassmorphism, responsive navigation).

---

## 2. Modules & Features

### A. Admin Panel
1. **Admin Authentication**: Secure login, session management.
2. **Dashboard**:
   - Total Revenue, Orders count, Active Users, Active Subscriptions metrics cards.
   - Sales analytics & interactive charts.
   - Recent orders & top-selling products table.
3. **Product CRUD**:
   - Create, Read, Update, Delete with categories, price, discount, inventory, specs, images, description.
4. **Category CRUD**:
   - Manage categories (Equipments, Supplements, Apparel, Training Programs, Accessories) with badges & banner images.
5. **Membership Plan CRUD**:
   - Manage fitness plans (e.g. Starter Fit, Pro Athlete, Elite 1-on-1 Coaching) with pricing, billing intervals, features list, perks.
6. **Order Management**:
   - View orders, filter by status (Pending, Processing, Shipped, Delivered, Cancelled), update tracking & fulfillment status, customer invoice view.
7. **User Management**:
   - View registered users, assign roles (Admin/User), view membership statuses, toggle active/blocked status.

### B. User Storefront (Personal Trainer Theme Replica)
1. **Hero & Dynamic Landing Page**:
   - Premium athletic hero section with CTA, featured programs, motivational banners.
   - Featured workout plans, top products carousel/grid, trainer showcase, client testimonials, newsletter subscription.
2. **Product Catalog & Detail View**:
   - Grid & list view with multi-faceted filtering (category, price range, ratings, in-stock).
   - Search with instant debounce auto-suggestions.
   - Rich Product Detail Page: image gallery, price/discount tags, quantity selector, add to cart, add to wishlist, reviews & ratings, related gear.
3. **Cart & Wishlist System**:
   - Slide-over Cart drawer and dedicated cart page with subtotal, discounts, and checkout.
   - Interactive Wishlist with 1-click move to cart.
4. **Checkout & Place Order**:
   - Multi-step checkout: Shipping address, billing details, payment method simulator, order summary.
   - Order confirmation screen with downloadable/printable invoice.
5. **Membership Plans**:
   - Dedicated membership comparison page, subscribe flow, perks checklist, instant active membership status.
6. **User Account & History**:
   - Profile management (avatar, personal fitness goals, phone, address).
   - Order history with detailed status tracker & receipts.
   - Active Membership management tab.
7. **Contact & About Pages**:
   - About Us (personal trainer biography, philosophy, fitness certifications).
   - Contact Us (contact form with backend submission, gym location details, FAQs).
