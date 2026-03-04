# PHASE 1: BACKEND FOUNDATION
## Weeks 1-4 (20 Working Days)

---

## 🎯 PHASE 1 GOAL
Create the core backend infrastructure: server, database, authentication, and basic API structure.

---

## ⏱️ TIMELINE OVERVIEW

| Week | Focus | Days |
|------|-------|------|
| Week 1 | Project Setup & Server | Days 1-5 |
| Week 2 | Database Schema | Days 6-10 |
| Week 3 | Authentication System | Days 11-15 |
| Week 4 | Core API Routes | Days 16-20 |

---

## 📋 PHASE 1 STEPS (One by One)

### WEEK 1: PROJECT SETUP & SERVER

#### Step 1.1 - Initialize Project (Day 1 - Morning)
**What:** Create the Node.js project structure
**Tasks:**
- [ ] Create `backend/` folder
- [ ] Run `npm init -y`
- [ ] Create `.gitignore` file
- [ ] Create basic folder structure

**Folder Structure:**
```
backend/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Auth, validation, etc.
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Helper functions
│   └── app.js         # Express app setup
├── tests/             # Test files
├── .env.example       # Environment template
├── .gitignore
└── package.json
```

---

#### Step 1.2 - Install Dependencies (Day 1 - Afternoon)
**What:** Install all required packages
**Tasks:**
- [ ] Install Express.js (web framework)
- [ ] Install PostgreSQL driver (pg)
- [ ] Install bcrypt (password hashing)
- [ ] Install jsonwebtoken (JWT auth)
- [ ] Install dotenv (environment variables)
- [ ] Install cors (cross-origin)
- [ ] Install helmet (security headers)

**Command:**
```bash
npm install express pg bcrypt jsonwebtoken dotenv cors helmet
npm install --save-dev nodemon jest
```

---

#### Step 1.3 - Create Server Entry Point (Day 2)
**What:** Create the main server file
**Tasks:**
- [ ] Create `src/app.js` (Express setup)
- [ ] Create `src/server.js` (server start)
- [ ] Add basic middleware (cors, helmet, json parser)
- [ ] Create health check route `/api/health`
- [ ] Test server starts successfully

**Test:** `npm run dev` → Visit `http://localhost:3000/api/health` → Should return `{ status: "OK" }`

---

#### Step 1.4 - Environment Configuration (Day 2)
**What:** Set up environment variables
**Tasks:**
- [ ] Create `.env.example` template
- [ ] Create `src/config/index.js`
- [ ] Define PORT, DATABASE_URL, JWT_SECRET

**Example .env:**
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/curia
JWT_SECRET=your-super-secret-key
```

---

#### Step 1.5 - Database Connection Setup (Day 3)
**What:** Configure PostgreSQL connection
**Tasks:**
- [ ] Create `src/config/database.js`
- [ ] Set up connection pool
- [ ] Add connection test function
- [ ] Handle connection errors

---

#### Step 1.6 - Error Handling Middleware (Day 4)
**What:** Create centralized error handling
**Tasks:**
- [ ] Create `src/middleware/errorHandler.js`
- [ ] Create custom error classes
- [ ] Add async handler wrapper
- [ ] Log errors properly

---

#### Step 1.7 - Logging Setup (Day 5)
**What:** Set up server logging
**Tasks:**
- [ ] Install winston (optional) or use console
- [ ] Create `src/utils/logger.js`
- [ ] Log requests, errors, and important events

---

### WEEK 2: DATABASE SCHEMA

#### Step 2.1 - Design Database Schema (Day 6)
**What:** Plan all database tables
**Tables Required:**
1. `users` - All user types (CREATOR, CEO, Staff)
2. `roles` - Role definitions
3. `permissions` - Permission definitions
4. `products` - Product catalog (windows, doors, etc.)
5. `manufacturers` - Manufacturer data
6. `pricing_rules` - Pricing configuration
7. `orders` - Customer orders
8. `order_items` - Order line items
9. `quotes` - Quote requests
10. `leads` - Lead generator data
11. `configurations` - Saved configurations
12. `audit_logs` - Track all changes

---

#### Step 2.2 - Create Users Table (Day 7)
**What:** Create the users table and model
**Schema:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role_id INTEGER REFERENCES roles(id),
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Tasks:**
- [ ] Create SQL migration file
- [ ] Create `src/models/User.js`
- [ ] Add CRUD functions

---

#### Step 2.3 - Create Roles & Permissions Tables (Day 8)
**What:** Set up role-based access
**Roles:**
1. CREATOR (level 1)
2. CREATOR_STAFF (level 2)
3. CEO (level 3)
4. OPERATIONS_MANAGER (level 4)
5. WAREHOUSE_STAFF (level 5)
6. SALES_STAFF (level 6)

**Tasks:**
- [ ] Create `roles` table
- [ ] Create `permissions` table
- [ ] Create `role_permissions` junction table
- [ ] Seed default roles

---

#### Step 2.4 - Create Products Table (Day 9)
**What:** Product catalog structure
**Schema:**
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_type VARCHAR(50) NOT NULL, -- 'window', 'door', 'rolladen'
    manufacturer_id INTEGER REFERENCES manufacturers(id),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    base_price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Tasks:**
- [ ] Create migration
- [ ] Create `src/models/Product.js`

---

#### Step 2.5 - Create Orders & OrderItems Tables (Day 10)
**What:** Order management schema
**Tasks:**
- [ ] Create `orders` table
- [ ] Create `order_items` table
- [ ] Create `src/models/Order.js`

---

### WEEK 3: AUTHENTICATION SYSTEM

#### Step 3.1 - Password Hashing Service (Day 11)
**What:** Secure password handling
**Tasks:**
- [ ] Create `src/services/authService.js`
- [ ] Implement `hashPassword()` function
- [ ] Implement `comparePassword()` function
- [ ] Use bcrypt with 12 salt rounds

---

#### Step 3.2 - JWT Token Service (Day 12)
**What:** Token generation and verification
**Tasks:**
- [ ] Create `src/services/tokenService.js`
- [ ] Implement `generateToken()` function
- [ ] Implement `verifyToken()` function
- [ ] Set token expiration (30 min as specified)

---

#### Step 3.3 - Auth Middleware (Day 13)
**What:** Protect routes with authentication
**Tasks:**
- [ ] Create `src/middleware/auth.js`
- [ ] Extract token from header
- [ ] Verify token and attach user to request
- [ ] Handle expired/invalid tokens

---

#### Step 3.4 - Role-Based Access Middleware (Day 14)
**What:** Check permissions based on role
**Tasks:**
- [ ] Create `src/middleware/roleAuth.js`
- [ ] Implement `requireRole()` function
- [ ] Implement `requirePermission()` function
- [ ] Block CEO from removing CREATOR_STAFF

---

#### Step 3.5 - Auth Routes (Day 15)
**What:** Login, Register, Logout endpoints
**Routes:**
```
POST /api/auth/register  - Register new user
POST /api/auth/login     - Login and get token
POST /api/auth/logout    - Invalidate token
POST /api/auth/refresh   - Refresh token
GET  /api/auth/me        - Get current user
```
**Tasks:**
- [ ] Create `src/controllers/authController.js`
- [ ] Create `src/routes/auth.js`
- [ ] Test all auth endpoints

---

### WEEK 4: CORE API ROUTES

#### Step 4.1 - Users API (Day 16)
**What:** User management endpoints
**Routes:**
```
GET    /api/users        - List users (filtered by role access)
GET    /api/users/:id    - Get user details
POST   /api/users        - Create user
PUT    /api/users/:id    - Update user
DELETE /api/users/:id    - Deactivate user
```
**Tasks:**
- [ ] Create `src/controllers/userController.js`
- [ ] Create `src/routes/users.js`
- [ ] Apply role restrictions

---

#### Step 4.2 - Products API (Day 17)
**What:** Product catalog endpoints
**Routes:**
```
GET    /api/products           - List products
GET    /api/products/:id       - Get product details
POST   /api/products           - Create product
PUT    /api/products/:id       - Update product
DELETE /api/products/:id       - Deactivate product
```
**Tasks:**
- [ ] Create `src/controllers/productController.js`
- [ ] Create `src/routes/products.js`

---

#### Step 4.3 - Input Validation (Day 18)
**What:** Validate all API inputs
**Tasks:**
- [ ] Install `express-validator` or `joi`
- [ ] Create validation schemas for each route
- [ ] Create `src/middleware/validate.js`
- [ ] Apply to all routes

---

#### Step 4.4 - API Rate Limiting (Day 19)
**What:** Prevent API abuse
**Tasks:**
- [ ] Install `express-rate-limit`
- [ ] Configure limits (100 requests per 15 min)
- [ ] Apply to auth routes (stricter: 5 per min)

---

#### Step 4.5 - Phase 1 Testing & Documentation (Day 20)
**What:** Test everything and document
**Tasks:**
- [ ] Write API documentation (README)
- [ ] Test all endpoints with Postman
- [ ] Create example requests/responses
- [ ] Fix any bugs found

---

## ✅ PHASE 1 COMPLETION CHECKLIST

By the end of Phase 1, you should have:

- [ ] Node.js/Express server running
- [ ] PostgreSQL database connected
- [ ] Users table with CRUD operations
- [ ] Roles & Permissions system
- [ ] Products table structure
- [ ] Orders table structure
- [ ] JWT authentication working
- [ ] Role-based access control working
- [ ] Input validation on all routes
- [ ] Rate limiting enabled
- [ ] Error handling centralized
- [ ] Basic logging in place

---

## 🚀 READY TO START?

**We will do this STEP BY STEP:**

1. I will guide you through each step
2. One step at a time
3. Test before moving to next step
4. No rushing

---

## FIRST STEP: Step 1.1 - Initialize Project

**Shall we begin with Step 1.1?**

This will:
1. Create the `backend/` folder structure
2. Initialize `package.json`
3. Create `.gitignore`

**Just confirm "Yes, let's start Step 1.1" and I will create the files.**

