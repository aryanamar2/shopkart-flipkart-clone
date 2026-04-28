# ShopKart - Flipkart Clone (Microservices)

A full-stack e-commerce application built with Spring Boot Microservices + React.

## Architecture

| Service          | Port | Database  |
|-----------------|------|-----------|
| API Gateway      | 8080 | -         |
| User Service     | 8081 | MySQL     |
| Product Service  | 8082 | MongoDB   |
| Order Service    | 8083 | MySQL     |
| Cart Service     | 8084 | MongoDB   |
| Payment Service  | 8085 | MySQL     |
| Frontend (React) | 3000 | -         |

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8.0+
- MongoDB 6.0+
- Node.js 18+

## Setup

### 1. MySQL Setup
```sql
-- Databases are auto-created. Just ensure MySQL is running on port 3306
-- Default credentials: root / root (change in application.yml if needed)
```

### 2. MongoDB Setup
```bash
# Ensure MongoDB is running on port 27017
mongod
```

### 3. Start Backend Services (in order)

```bash
# User Service
cd user-service && mvn spring-boot:run

# Product Service
cd product-service && mvn spring-boot:run

# Order Service
cd order-service && mvn spring-boot:run

# Cart Service
cd cart-service && mvn spring-boot:run

# Payment Service
cd payment-service && mvn spring-boot:run

# API Gateway
cd api-gateway && mvn spring-boot:run
```

### 4. Start Frontend

```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000

## Features

- User Registration & Login (JWT Auth)
- Product Browsing by Category
- Product Search
- Product Reviews & Ratings
- Shopping Cart (Add/Remove/Update)
- Multi-step Checkout
- Order Tracking
- Payment Processing (COD, UPI, Card, Net Banking)
- Responsive UI (Flipkart-like design)

## API Endpoints

### User Service (via Gateway)
- POST /api/users/register
- POST /api/users/login
- GET  /api/users/{id}

### Product Service (via Gateway)
- GET  /api/products
- GET  /api/products/{id}
- GET  /api/products/category/{category}
- GET  /api/products/search?keyword=
- POST /api/products/{id}/reviews

### Cart Service (via Gateway)
- GET    /api/cart/{userId}
- POST   /api/cart/{userId}/add
- PUT    /api/cart/{userId}/update/{productId}
- DELETE /api/cart/{userId}/remove/{productId}

### Order Service (via Gateway)
- POST /api/orders
- GET  /api/orders/user/{userId}

### Payment Service (via Gateway)
- POST /api/payments/process
