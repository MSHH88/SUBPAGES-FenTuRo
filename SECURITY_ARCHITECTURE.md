# SECURITY ARCHITECTURE
## FenTuRo E-Commerce Platform / CURIA CRM

---

## 🔐 OVERVIEW: Security is NOT in Frontend Code

**Your Question:** "Will security be in the code directly for the website and customer data backend CRM all?"

**Answer:** **NO** - Security is NEVER embedded directly in frontend code.

---

## 🏗️ SECURITY LAYERS (Where Security Lives)

### Layer 1: Frontend (Website)
```
❌ NO SECURITY HERE
- Only displays information
- No passwords, API keys, or sensitive data
- Cannot access database directly
- All data comes FROM the backend
```

### Layer 2: Backend API (Node.js/Express)
```
✅ SECURITY LAYER 1: Authentication
- JWT (JSON Web Tokens) for user sessions
- Password hashing (bcrypt)
- Session management
- Login/logout handling

✅ SECURITY LAYER 2: Authorization
- Role-based access control (CREATOR, CEO, etc.)
- Permission checking before every action
- API endpoint protection
```

### Layer 3: Database (PostgreSQL)
```
✅ SECURITY LAYER 3: Data Protection
- Encrypted passwords (never stored plain text)
- Encrypted sensitive data
- Connection via SSL
- Access only through backend (never direct)
```

### Layer 4: Server (Render/Hosting)
```
✅ SECURITY LAYER 4: Infrastructure
- HTTPS everywhere (SSL/TLS)
- Firewall protection
- DDoS protection
- Secure environment variables
```

---

## 🔒 WHAT IS PROTECTED AND WHERE

### Customer Data
| Data Type | Storage | Encryption | Access |
|-----------|---------|------------|--------|
| Email | Database | No | Backend only |
| Password | Database | YES (bcrypt hash) | Never readable |
| Name/Address | Database | No | Backend + CRM |
| Orders | Database | No | Backend + CRM |
| Payment Info | Payment Provider | N/A | Never stored by us |

### CRM Data
| Data Type | Storage | Encryption | Access |
|-----------|---------|------------|--------|
| User accounts | Database | Password hashed | Backend only |
| Session tokens | Memory/JWT | YES | Per-user |
| API Keys | Environment | YES | Server only |
| Lead data | Database | No | CRM (role-based) |

### Backend Secrets
| Secret | Location | In Code? |
|--------|----------|----------|
| Database password | Environment Variable | ❌ NO |
| JWT secret key | Environment Variable | ❌ NO |
| Payment API keys | Environment Variable | ❌ NO |
| Email service key | Environment Variable | ❌ NO |

---

## 🛡️ SECURITY FEATURES IMPLEMENTED

### 1. Authentication
```javascript
// How it works (simplified):

// 1. User logs in
POST /api/auth/login
Body: { email: "user@example.com", password: "mypassword" }

// 2. Backend checks password hash
const isValid = await bcrypt.compare(password, user.hashedPassword);

// 3. If valid, create JWT token
const token = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '30m' });

// 4. Token returned to browser (stored in httpOnly cookie)
// 5. Every request includes token for verification
```

### 2. Authorization (Role Checking)
```javascript
// How roles are checked (simplified):

// Middleware on every protected route
app.get('/api/admin/users', authenticate, authorize(['CREATOR']), (req, res) => {
    // Only CREATOR can access this
});

// Authorization middleware
function authorize(allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
}
```

### 3. Password Security
```javascript
// Passwords are NEVER stored as plain text

// When user registers:
const hashedPassword = await bcrypt.hash(password, 12);
// Stored: "$2b$12$xyz..." (unreadable hash)

// When user logs in:
const isValid = await bcrypt.compare(inputPassword, storedHash);
// Returns true/false, original password never known
```

### 4. SQL Injection Prevention
```javascript
// NEVER do this:
❌ const query = `SELECT * FROM users WHERE email = '${email}'`;

// ALWAYS do this:
✅ const query = 'SELECT * FROM users WHERE email = $1';
✅ const result = await db.query(query, [email]);
// Parameters are automatically escaped
```

### 5. XSS Prevention
```javascript
// All user input is sanitized before display
// React automatically escapes HTML by default

// Additional: Content Security Policy headers
app.use(helmet()); // Sets security headers
```

### 6. HTTPS Only
```
// All connections are encrypted
// HTTP automatically redirects to HTTPS
// Cookies are secure + httpOnly
```

---

## 🔑 ROLE-BASED ACCESS CONTROL

### How Roles Protect Data

```
CREATOR (You)
├── Can see: EVERYTHING
├── Can do: EVERYTHING
├── Lead Generator: ✅ VISIBLE
└── Can block: Anyone

CREATOR'S STAFF (Your team)
├── Can see: Most things
├── Can do: Manage websites, catalog
├── Lead Generator: ❌ HIDDEN (unless you grant)
└── Cannot be blocked by: CEO

CEO (Business owner)
├── Can see: Their CRM data
├── Can do: Manage their staff
├── Lead Generator: ❌ HIDDEN
└── Cannot see: Other clients, CREATOR info

OPERATIONS MANAGER
├── Can see: Catalog, inventory, orders
├── Can do: Manage products
└── Cannot see: Lead data, financials

WAREHOUSE STAFF
├── Can see: Orders, inventory
├── Can do: Update order status
└── Cannot see: Customer details, pricing

SALES STAFF
├── Can see: Quotes, discounts
├── Can do: Create quotes
└── Cannot see: Full catalog pricing
```

---

## 🔐 LEAD GENERATOR SECURITY

**Special Protection for CREATOR-Only Section:**

```javascript
// This section is COMPLETELY HIDDEN from all other roles

// Database query adds filter:
if (user.role !== 'CREATOR' && !user.hasLeadAccess) {
    // Don't even show the menu item
    // Return 404 if someone tries to access URL
}

// Even in API responses, this data is filtered out
// CEO cannot see it, cannot know it exists
// Only CREATOR can grant access to specific people
```

---

## 🛡️ PAYMENT SECURITY

**We do NOT handle payment data directly:**

```
User enters card → Payment Provider (PayPal/Stripe)
                         ↓
              Processes payment
                         ↓
              Returns: "Payment successful" + ID
                         ↓
              We store: Only transaction ID
                         ↓
              Never store: Card numbers, CVV, etc.
```

**PCI DSS Compliance:**
- Card data never touches our servers
- Payment forms are iframes from payment provider
- We only receive success/failure + transaction ID

---

## 🔒 DATA PROTECTION (GDPR)

### What We Store
- Email, name, address (for orders)
- Order history
- Configuration saves (if logged in)
- Traffic/analytics (anonymized)

### What We Don't Store
- Credit card numbers
- CVV codes
- Plain text passwords
- Unnecessary personal data

### User Rights
- Right to access their data
- Right to delete their account
- Right to export their data
- Right to opt out of marketing

---

## 📊 SECURITY MONITORING

### Implemented Logging
```
- Failed login attempts (rate limited)
- Password changes
- Permission changes
- Admin actions
- Data exports
```

### Alerts
```
- Multiple failed logins from same IP
- Unusual activity patterns
- Permission escalation attempts
- Large data exports
```

---

## ✅ SECURITY CHECKLIST FOR DEVELOPMENT

### Phase 1-2 (Backend):
- [ ] Setup environment variables (no secrets in code)
- [ ] Implement bcrypt password hashing
- [ ] Setup JWT authentication
- [ ] Create role-based middleware
- [ ] Enable HTTPS
- [ ] Setup SQL injection prevention
- [ ] Add rate limiting

### Phase 4 (CRM):
- [ ] Implement role-based UI hiding
- [ ] Add audit logging
- [ ] Setup session timeout (30 min)
- [ ] Create CREATOR-only Lead Generator

### Phase 6 (Launch):
- [ ] Security audit
- [ ] Penetration testing
- [ ] GDPR compliance check
- [ ] Privacy policy update

---

## 🚨 IMPORTANT NOTES

1. **Never commit secrets to Git**
   - Use `.env` files (gitignored)
   - Use environment variables on Render

2. **Frontend is PUBLIC**
   - Assume anyone can see frontend code
   - Never put API keys or passwords in frontend
   - All secrets stay on backend only

3. **Backend validates EVERYTHING**
   - Never trust frontend data
   - Always re-validate on server
   - Assume all input is malicious

4. **Regular updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Patch vulnerabilities quickly

---

## Summary

| Question | Answer |
|----------|--------|
| Is security in frontend code? | ❌ NO |
| Where are passwords stored? | Backend database (hashed) |
| Who can access customer data? | Only authenticated backend |
| Can CEO see Lead Generator? | ❌ NO (CREATOR only) |
| Are payment details stored? | ❌ NO (payment provider handles) |
| Is HTTPS required? | ✅ YES (always) |
