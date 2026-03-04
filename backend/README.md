# CURIA Backend

Window/Door Configurator E-Commerce Platform Backend

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT + bcrypt

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 3. Start Development Server

```bash
npm run dev
```

## Project Structure

```
backend/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Express middleware
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   ├── utils/        # Utility functions
│   └── server.js     # Entry point
├── package.json
├── .env.example
└── .gitignore
```

## API Endpoints (Coming Soon)

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/products` - Get products
- `POST /api/orders` - Create order

## Security

- Passwords hashed with bcrypt
- JWT for authentication
- Rate limiting enabled
- CORS configured
- Security headers via helmet
