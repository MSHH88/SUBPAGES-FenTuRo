# CURIA Backend Dependencies

## 📥 DOWNLOAD LINKS

### Required Software (Install First)

| Software | Download Link | Version | Cost |
|----------|--------------|---------|------|
| **Node.js** | https://nodejs.org/ | 18.x LTS or 20.x LTS | ✅ FREE |
| **PostgreSQL** | https://www.postgresql.org/download/ | 15.x or 16.x | ✅ FREE |
| **Git** | https://git-scm.com/downloads | Latest | ✅ FREE |
| **VS Code** (Optional) | https://code.visualstudio.com/ | Latest | ✅ FREE |

---

## 📦 NPM PACKAGES (Auto-Installed via `npm install`)

All packages below are installed automatically when you run `npm install` in the backend folder.

### Core Dependencies (Production)

| Package | Purpose | Weekly Downloads | Cost |
|---------|---------|-----------------|------|
| **express** | Web server framework | 30M+ | ✅ FREE |
| **pg** | PostgreSQL database driver | 3M+ | ✅ FREE |
| **bcryptjs** | Password hashing | 2M+ | ✅ FREE |
| **jsonwebtoken** | JWT token generation | 10M+ | ✅ FREE |
| **cors** | Cross-origin requests | 10M+ | ✅ FREE |
| **helmet** | Security headers | 2M+ | ✅ FREE |
| **dotenv** | Environment variables | 25M+ | ✅ FREE |
| **express-validator** | Input validation | 1M+ | ✅ FREE |
| **express-rate-limit** | API rate limiting | 500K+ | ✅ FREE |
| **winston** | Logging | 5M+ | ✅ FREE |
| **uuid** | Unique ID generation | 50M+ | ✅ FREE |

### Development Dependencies

| Package | Purpose | Cost |
|---------|---------|------|
| **nodemon** | Auto-restart on changes | ✅ FREE |
| **jest** | Testing framework | ✅ FREE |
| **eslint** | Code linting | ✅ FREE |

---

## 🏆 WHY THESE DEPENDENCIES?

### Express.js (Web Framework)
- **Industry Standard:** #1 most used Node.js framework
- **Used by:** IBM, Uber, Netflix, PayPal
- **Alternatives considered:**
  - Fastify (faster but smaller community)
  - Koa (same creator, less popular)
  - Hapi (enterprise but complex)
- **Winner:** Express - largest community, most tutorials, best support

### PostgreSQL (Database)
- **Industry Standard:** #1 open-source relational database
- **Used by:** Apple, Instagram, Spotify, Netflix
- **Alternatives considered:**
  - MySQL (less features)
  - MongoDB (not relational - bad for e-commerce)
  - SQLite (not production-ready)
- **Winner:** PostgreSQL - ACID compliant, perfect for financial data

### bcryptjs (Password Hashing)
- **Industry Standard:** Most secure password hashing
- **Used by:** Every major platform
- **Alternatives considered:**
  - bcrypt (native, requires compilation)
  - argon2 (newer, less support)
- **Winner:** bcryptjs - pure JavaScript, no compilation issues

### jsonwebtoken (Authentication)
- **Industry Standard:** JWT for stateless auth
- **Used by:** Auth0, Okta, every modern API
- **Winner:** No real alternative for JWT

### helmet (Security)
- **Industry Standard:** Express security middleware
- **Sets:** 15+ security headers automatically
- **Winner:** Only real option for Express security headers

### winston (Logging)
- **Industry Standard:** Most popular Node.js logger
- **Features:** Multiple transports, log levels, formatting
- **Alternatives considered:**
  - Pino (faster but less features)
  - Bunyan (older, less maintained)
- **Winner:** Winston - most features, best flexibility

---

## 💰 TOTAL COST

| Category | Cost |
|----------|------|
| Node.js | FREE |
| PostgreSQL | FREE |
| All NPM Packages | FREE |
| VS Code | FREE |
| Git | FREE |
| **TOTAL** | **$0** |

---

## 🔧 INSTALLATION STEPS

### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download LTS version (18.x or 20.x)
3. Run installer
4. Verify: `node --version` in terminal

### Step 2: Install PostgreSQL
1. Go to https://www.postgresql.org/download/
2. Choose your OS (Windows/Mac/Linux)
3. Download and run installer
4. **Remember your password!** (You'll need it)
5. Verify: `psql --version` in terminal

### Step 3: Install Dependencies
```bash
cd backend
npm install
```

This automatically downloads all 14 packages listed above.

---

## ⚙️ VERSION REQUIREMENTS

| Software | Minimum | Recommended |
|----------|---------|-------------|
| Node.js | 18.0.0 | 20.x LTS |
| PostgreSQL | 14.0 | 16.x |
| npm | 8.0.0 | 10.x |

---

## 🛡️ SECURITY NOTES

- All packages are from **npm** (official Node.js package registry)
- All packages have **MIT** or similar open-source licenses
- All packages are **actively maintained** (updated within last 6 months)
- No packages have **known vulnerabilities** (verified via `npm audit`)

---

## 📊 COMPARISON: Our Stack vs Alternatives

| Aspect | Our Choice | Alternative | Why Our Choice |
|--------|-----------|-------------|----------------|
| Language | Node.js | Python/Django | Faster, same language as frontend |
| Framework | Express | FastAPI | Larger community, more resources |
| Database | PostgreSQL | MongoDB | Better for financial/order data |
| Auth | JWT | Session | Stateless, scalable, industry standard |
| Hosting | Render | Heroku | EU servers (Frankfurt), free tier |

---

## ✅ CHECKLIST

Before starting development:

- [ ] Node.js installed (v18+)
- [ ] PostgreSQL installed (v14+)
- [ ] Git installed
- [ ] VS Code installed (optional but recommended)
- [ ] Terminal/Command Prompt access

When ready, run:
```bash
cd backend
npm install
```

This will install all dependencies automatically.
