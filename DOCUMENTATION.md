# ShopKart - Complete Project Documentation
## Flipkart Clone | Spring Boot Microservices + React

---

## 1. PROJECT OVERVIEW

ShopKart is a full-stack e-commerce application similar to Flipkart built using:
- **Backend**: Spring Boot Microservices (Java 21)
- **Databases**: MySQL 8.0 (relational data) + MongoDB 6.0 (flexible/catalog data)
- **Frontend**: React 18 + CSS
- **Service Discovery**: Netflix Eureka Server
- **Architecture**: Microservices — each feature is a completely independent service

---

## 2. TECH STACK

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Axios, React Toastify, React Icons |
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA, Spring Data MongoDB |
| Auth | JWT (JSON Web Token) |
| Databases | MySQL 8.0, MongoDB 6.0 |
| Service Discovery | Netflix Eureka Server |
| Build Tool | Maven 3.8 |
| Java Version | Java 21 (OpenJDK Temurin) |
| Node Version | v20.x |

---

## 3. ARCHITECTURE DIAGRAM

```
[React Frontend :3000]
         |
         | Direct HTTP calls to each service
         |
  ┌──────┴────────────────────────────────────────┐
  │                                               │
  ▼                                               ▼
[User Service :8081]              [Product Service :8082]
[MySQL - ecommerce_users]         [MongoDB - ecommerce_products]
  - Register / Login                - Products CRUD
  - JWT Token Generation            - Reviews & Ratings
  - User Profile                    - Search & Filter by Category

[Order Service :8083]             [Cart Service :8084]
[MySQL - ecommerce_orders]        [MongoDB - ecommerce_cart]
  - Place Orders                    - Add / Remove Items
  - Order History                   - Update Quantity
  - Order Status Tracking           - Cart Total Calculation

[Payment Service :8085]           [Eureka Server :8761]
[MySQL - ecommerce_payments]      [Service Registry]
  - Process Payment                 - All services register here
  - Transaction ID Generation       - Dashboard at localhost:8761
  - Payment History
```

---

## 4. PROJECT FOLDER STRUCTURE

```
F:\flipkart-clone\
├── eureka-server\          → Service Discovery Server (Port 8761)
├── user-service\           → User Auth Service (Port 8081) - MySQL
├── product-service\        → Product Catalog Service (Port 8082) - MongoDB
├── order-service\          → Order Management Service (Port 8083) - MySQL
├── cart-service\           → Shopping Cart Service (Port 8084) - MongoDB
├── payment-service\        → Payment Processing Service (Port 8085) - MySQL
├── api-gateway\            → API Gateway (Port 8080) - Optional
├── frontend\               → React Application (Port 3000)
├── DOCUMENTATION.md        → This file
└── README.md               → Quick start guide
```

---

## 5. PREREQUISITES

Before running the project, make sure these are installed:

| Software | Version | Check Command |
|----------|---------|---------------|
| Java JDK | 17+ | `java -version` |
| Maven | 3.8+ | `mvn -version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| MySQL | 8.0 | Running on port 3306 |
| MongoDB | 6.0 | Running on port 27017 |

---

## 6. HOW TO RUN — STEP BY STEP

### Step 1 — Verify MySQL is Running
Open Services (`Win + R` → `services.msc`):
- Find **MySQL80** → Status should be **Running**
- If not → Right click → Start

MySQL credentials used in this project:
```
Host     : localhost
Port     : 3306
Username : root
Password : Root@1234
```

### Step 2 — Verify MongoDB is Running
Open Services (`Win + R` → `services.msc`):
- Find **MongoDB** → Status should be **Running**
- If not → Right click → Start

MongoDB connection:
```
URI : mongodb://localhost:27017
```

### Step 3 — Start Eureka Server FIRST
Open a new terminal:
```bash
cd /d F:\flipkart-clone\eureka-server
mvn spring-boot:run
```
Wait until you see:
```
Started EurekaServerApplication in X seconds
```
Verify at: **http://localhost:8761** — you should see the Eureka Dashboard.

### Step 4 — Start User Service
Open a new terminal:
```bash
cd /d F:\flipkart-clone\user-service
mvn spring-boot:run
```
Wait for: `Started UserServiceApplication in X seconds`

### Step 5 — Start Product Service
Open a new terminal:
```bash
cd /d F:\flipkart-clone\product-service
mvn spring-boot:run
```
Wait for: `Started ProductServiceApplication in X seconds`

### Step 6 — Start Order Service
Open a new terminal:
```bash
cd /d F:\flipkart-clone\order-service
mvn spring-boot:run
```
Wait for: `Started OrderServiceApplication in X seconds`

### Step 7 — Start Cart Service
Open a new terminal:
```bash
cd /d F:\flipkart-clone\cart-service
mvn spring-boot:run
```
Wait for: `Started CartServiceApplication in X seconds`

### Step 8 — Start Payment Service
Open a new terminal:
```bash
cd /d F:\flipkart-clone\payment-service
mvn spring-boot:run
```
Wait for: `Started PaymentServiceApplication in X seconds`

### Step 9 — Start React Frontend
Open a new terminal:
```bash
cd /d F:\flipkart-clone\frontend
npm install
npm start
```
Browser opens automatically at: **http://localhost:3000**

### Step 10 — Verify All Services on Eureka
Open: **http://localhost:8761**

You should see all 5 services registered:
```
✅ USER-SERVICE      → UP (1) - port 8081
✅ PRODUCT-SERVICE   → UP (1) - port 8082
✅ ORDER-SERVICE     → UP (1) - port 8083
✅ CART-SERVICE      → UP (1) - port 8084
✅ PAYMENT-SERVICE   → UP (1) - port 8085
```

---

## 7. PORTS REFERENCE

| Service | Port | Database | Status |
|---------|------|----------|--------|
| Eureka Server | 8761 | - | Start First |
| User Service | 8081 | MySQL | ✅ |
| Product Service | 8082 | MongoDB | ✅ |
| Order Service | 8083 | MySQL | ✅ |
| Cart Service | 8084 | MongoDB | ✅ |
| Payment Service | 8085 | MySQL | ✅ |
| React Frontend | 3000 | - | ✅ |
| MySQL | 3306 | - | ✅ |
| MongoDB | 27017 | - | ✅ |

---

## 8. SERVICE-BY-SERVICE EXPLANATION

---

### 8.1 EUREKA SERVER (Port 8761)

**Purpose**: Acts as a service registry — like a phone directory for all microservices.

**How it works**:
- Every microservice registers itself with Eureka on startup
- Eureka keeps track of which services are UP or DOWN
- Services send heartbeats every 30 seconds to stay registered
- Dashboard at `http://localhost:8761` shows all registered services

**Why it must start first**:
- All other services try to register with Eureka on startup
- If Eureka is not running, they get `Connection refused` errors
- The services still work but keep retrying to connect

**Key file**:
```java
@SpringBootApplication
@EnableEurekaServer  // This annotation makes it a Eureka Server
public class EurekaServerApplication { }
```

---

### 8.2 USER SERVICE (Port 8081) — MySQL

**Purpose**: Handles all user operations — registration, login, profile management.

**Database**: MySQL → `ecommerce_users`

**Tables auto-created by Hibernate**:
```sql
users     (id, name, email, password, phone, role, created_at)
addresses (id, user_id, street, city, state, pincode, country, is_default)
```

**Folder Structure**:
```
user-service/src/main/java/com/ecommerce/userservice/
├── model/
│   ├── User.java           → @Entity mapped to 'users' table
│   └── Address.java        → @Entity mapped to 'addresses' table
├── repository/
│   ├── UserRepository.java      → findByEmail(), existsByEmail()
│   └── AddressRepository.java   → findByUserId()
├── service/
│   └── UserService.java    → register(), login(), getUserById(), updateUser()
├── controller/
│   └── UserController.java → REST API endpoints
└── config/
    ├── JwtUtil.java         → generateToken(), validateToken(), extractEmail()
    └── SecurityConfig.java  → Disable CSRF, BCrypt password encoder
```

**API Endpoints**:
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | /api/users/register | Create account | `{name, email, password, phone}` |
| POST | /api/users/login | Login | `{email, password}` |
| GET | /api/users/{id} | Get profile | - |
| PUT | /api/users/{id} | Update profile | `{name, phone}` |

**Registration Flow**:
```
1. Frontend sends {name, email, password, phone}
2. Check if email already exists → throw error if yes
3. Encrypt password using BCrypt
4. Save user to MySQL
5. Return saved user object
```

**Login Flow**:
```
1. Frontend sends {email, password}
2. Find user by email in MySQL
3. BCrypt.matches(inputPassword, storedHashedPassword)
4. If match → generate JWT token (expires in 24 hours)
5. Return {token, user} to frontend
6. Frontend stores token in localStorage
7. Token sent in every subsequent request as Authorization header
```

**JWT Token**:
- Contains: email, role, expiry time
- Secret key: configured in application.yml
- Expiry: 24 hours (86400000 ms)

---

### 8.3 PRODUCT SERVICE (Port 8082) — MongoDB

**Purpose**: Manages entire product catalog — CRUD, search, categories, reviews.

**Database**: MongoDB → `ecommerce_products`

**Collections**:
```
products  → {id, name, description, price, discountedPrice, discountPercent,
             quantity, brand, category, subCategory, imageUrls[], rating,
             reviewCount, inStock, createdAt}

reviews   → {id, productId, userId, userName, rating, comment, createdAt}
```

**Why MongoDB for Products?**
- Products have different attributes (phone has RAM, shirt has size)
- MongoDB's flexible schema handles varying product attributes
- Fast reads for large product catalogs
- No need for complex joins

**Folder Structure**:
```
product-service/src/main/java/com/ecommerce/productservice/
├── model/
│   ├── Product.java    → @Document(collection = "products")
│   └── Review.java     → @Document(collection = "reviews")
├── repository/
│   ├── ProductRepository.java  → findByCategory(), searchByName(), findByBrand()
│   └── ReviewRepository.java   → findByProductId()
├── service/
│   └── ProductService.java → createProduct(), searchProducts(), addReview()
└── controller/
    └── ProductController.java → REST API endpoints
```

**API Endpoints**:
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/{id} | Get single product |
| GET | /api/products/category/{cat} | Filter by category |
| GET | /api/products/search?keyword= | Search by name |
| POST | /api/products | Add new product |
| PUT | /api/products/{id} | Update product |
| DELETE | /api/products/{id} | Delete product |
| POST | /api/products/{id}/reviews | Add review |
| GET | /api/products/{id}/reviews | Get all reviews |

**Add Product Flow**:
```
1. Login → Account Menu → Add Product
2. Fill form (name, brand, category, price, discount%, qty, description, images)
3. Frontend sends POST /api/products
4. ProductService calculates:
   discountedPrice = price × (1 - discountPercent / 100)
5. Saved to MongoDB
6. Product appears on homepage and product listing
```

**Auto Discount Calculation**:
```java
double discounted = price * (1 - discountPercent / 100.0);
product.setDiscountedPrice(Math.round(discounted * 100.0) / 100.0);
```

---

### 8.4 ORDER SERVICE (Port 8083) — MySQL

**Purpose**: Manages order placement, order history, and order status tracking.

**Database**: MySQL → `ecommerce_orders`

**Tables auto-created**:
```sql
orders      (id, user_id, status, total_amount, payment_method, payment_status,
             shipping_street, shipping_city, shipping_state, shipping_pincode,
             created_at, updated_at)

order_items (id, order_id, product_id, product_name, image_url,
             quantity, price, total_price)
```

**Why MySQL for Orders?**
- Orders involve money → need ACID transactions
- Relational data: one order has many items (foreign key relationship)
- Need reliable joins between orders and order_items

**Order Status Flow**:
```
PENDING → CONFIRMED → SHIPPED → DELIVERED
                             ↘ CANCELLED
```

**Folder Structure**:
```
order-service/src/main/java/com/ecommerce/orderservice/
├── model/
│   ├── Order.java      → @Entity, @OneToMany(items)
│   └── OrderItem.java  → @Entity, @ManyToOne(order)
├── repository/
│   └── OrderRepository.java → findByUserId(), findByStatus()
├── service/
│   └── OrderService.java → createOrder(), updateStatus()
└── controller/
    └── OrderController.java → REST API endpoints
```

**API Endpoints**:
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Place new order |
| GET | /api/orders/user/{userId} | Get user's orders |
| GET | /api/orders/{id} | Get single order |
| PUT | /api/orders/{id}/status | Update order status |
| GET | /api/orders | Get all orders (admin) |

**Place Order Flow**:
```
1. User completes checkout form (address + payment method)
2. Frontend sends POST /api/orders with items from cart
3. OrderService loops through items, sets order reference on each
4. Calculates totalAmount = sum of all item.totalPrice
5. Saves order + items to MySQL (cascade)
6. Returns created order with generated ID
```

---

### 8.5 CART SERVICE (Port 8084) — MongoDB

**Purpose**: Manages shopping cart for each user — add, remove, update items.

**Database**: MongoDB → `ecommerce_cart`

**Collection**:
```
carts → {id, userId, items: [{productId, productName, imageUrl,
          price, quantity, totalPrice}], totalAmount}
```

**Why MongoDB for Cart?**
- Cart is a temporary, frequently updated document
- Embedding items inside cart = single document read (very fast)
- No complex joins needed
- Easy to clear entire cart in one operation

**Folder Structure**:
```
cart-service/src/main/java/com/ecommerce/cartservice/
├── model/
│   ├── Cart.java     → @Document — one per user
│   └── CartItem.java → Embedded object inside Cart
├── repository/
│   └── CartRepository.java → findByUserId()
├── service/
│   └── CartService.java → addToCart(), updateQuantity(), removeFromCart()
└── controller/
    └── CartController.java → REST API endpoints
```

**API Endpoints**:
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart/{userId} | Get user's cart |
| POST | /api/cart/{userId}/add | Add item to cart |
| PUT | /api/cart/{userId}/update/{productId} | Update quantity |
| DELETE | /api/cart/{userId}/remove/{productId} | Remove item |
| DELETE | /api/cart/{userId}/clear | Clear entire cart |

**Add to Cart Flow**:
```
1. User clicks "Add to Cart" on product page
2. Frontend sends POST /api/cart/{userId}/add with item details
3. CartService finds existing cart for user (or creates new one)
4. Checks if product already in cart:
   - YES → increase quantity, recalculate item total
   - NO  → add new item to list
5. Recalculate cart total = sum of all item totals
6. Save updated cart to MongoDB
7. Cart icon in navbar updates count
```

---

### 8.6 PAYMENT SERVICE (Port 8085) — MySQL

**Purpose**: Processes payments and stores transaction records.

**Database**: MySQL → `ecommerce_payments`

**Table auto-created**:
```sql
payments (id, order_id, user_id, amount, method, status,
          transaction_id, created_at)
```

**Why MySQL for Payments?**
- Financial data needs ACID transactions
- Payment records must never be lost
- Need reliable audit trail

**Supported Payment Methods**:
- 💵 COD (Cash on Delivery)
- 📱 UPI
- 💳 Credit/Debit Card
- 🏦 Net Banking

**Folder Structure**:
```
payment-service/src/main/java/com/ecommerce/paymentservice/
├── model/
│   └── Payment.java → @Entity mapped to 'payments' table
├── repository/
│   └── PaymentRepository.java → findByOrderId(), findByUserId()
├── service/
│   └── PaymentService.java → processPayment(), getPaymentByOrder()
└── controller/
    └── PaymentController.java → REST API endpoints
```

**API Endpoints**:
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payments/process | Process payment |
| GET | /api/payments/order/{orderId} | Get payment by order |
| GET | /api/payments/{id} | Get payment by ID |

**Payment Processing Flow**:
```
1. Order is created first (Order Service)
2. Frontend sends POST /api/payments/process
   {orderId, userId, amount, method}
3. PaymentService generates unique Transaction ID:
   TXN-XXXXXXXX (e.g. TXN-A3F9B2C1)
4. Sets status = SUCCESS
5. Saves to MySQL
6. Returns payment record to frontend
7. Frontend clears cart and shows success page
```

---

## 9. FRONTEND STRUCTURE (React)

```
frontend/src/
├── App.js                      → Main router with all page routes
├── index.js                    → Entry point
├── index.css                   → Global styles (scrollbar, fonts, reset)
├── context/
│   ├── AuthContext.js          → Global auth state (user, token, login, logout)
│   └── CartContext.js          → Global cart state (cart, addToCart, removeItem)
├── services/
│   └── api.js                  → All API calls to all backend services
└── components/
    ├── Navbar/
    │   ├── Navbar.js           → Top bar with search, user menu, cart icon
    │   └── Navbar.css
    ├── Home/
    │   ├── Home.js             → Homepage: banner, categories, featured products
    │   └── Home.css
    ├── Product/
    │   ├── ProductList.js      → Product grid with sort and price filter
    │   ├── ProductList.css
    │   ├── ProductDetail.js    → Single product with images, reviews
    │   └── ProductDetail.css
    ├── Cart/
    │   ├── Cart.js             → Cart page with quantity controls
    │   └── Cart.css
    ├── Auth/
    │   ├── Login.js            → Login form
    │   ├── Register.js         → Registration form
    │   └── Auth.css
    ├── Order/
    │   ├── Orders.js           → Order history with status badges
    │   └── Orders.css
    ├── Payment/
    │   ├── Checkout.js         → 3-step checkout (Address→Payment→Review)
    │   └── Checkout.css
    └── Admin/
        ├── AddProduct.js       → Add new product form
        └── AddProduct.css
```

**Page Routes**:
| Route | Component | Description |
|-------|-----------|-------------|
| / | Home | Homepage |
| /products | ProductList | All products |
| /products/category/:cat | ProductList | Filtered by category |
| /products/search?q= | ProductList | Search results |
| /product/:id | ProductDetail | Single product |
| /cart | Cart | Shopping cart |
| /login | Login | Login page |
| /register | Register | Register page |
| /orders | Orders | Order history |
| /checkout | Checkout | Checkout flow |
| /add-product | AddProduct | Add new product |

**React Context**:
- `AuthContext` — stores logged-in user and JWT token globally
- `CartContext` — stores cart data, syncs with Cart Service API

---

## 10. END-TO-END USER FLOWS

### Flow 1 — Register & Login
```
Open http://localhost:3000
→ Click Login → Create Account
→ Fill: Name, Email, Password, Phone
→ Submit → POST /api/users/register (User Service)
→ Password encrypted with BCrypt → saved to MySQL
→ Redirected to Login page
→ Enter email + password → POST /api/users/login
→ JWT token returned → stored in localStorage
→ User name appears in Navbar
```

### Flow 2 — Add a Product
```
Login → Hover over name → Click "Add Product"
→ Fill form: name, brand, category, price, discount, qty, description, image URL
→ Submit → POST /api/products (Product Service)
→ discountedPrice auto-calculated
→ Saved to MongoDB
→ Redirected to /products
→ Product visible on homepage and product list
```

### Flow 3 — Browse & Search
```
Homepage → Click category card (e.g. Electronics)
→ GET /api/products/category/Electronics
→ ProductList shows filtered results
→ Use sort dropdown (price low-high, high-low, rating)
→ Use price range slider to filter

OR

Type in search bar → press Enter
→ GET /api/products/search?keyword=iphone
→ Shows matching products
```

### Flow 4 — Add to Cart
```
Click any product → ProductDetail page
→ GET /api/products/{id}
→ Click "Add to Cart"
→ POST /api/cart/{userId}/add
→ Cart icon count increases in Navbar
→ Go to Cart page → see all items
→ Use +/- buttons to change quantity
→ Click X to remove item
```

### Flow 5 — Place Order (Checkout)
```
Cart page → Click "Place Order"
→ Checkout Step 1: Enter delivery address
   (Street, City, State, Pincode)
→ Checkout Step 2: Choose payment method
   (COD / UPI / Card / Net Banking)
→ Checkout Step 3: Review order summary
→ Click "Place Order ₹XXXX"
→ POST /api/orders → Order created in MySQL
→ POST /api/payments/process → Payment processed
→ Transaction ID generated (TXN-XXXXXXXX)
→ Cart cleared → DELETE /api/cart/{userId}/clear
→ Success page shown with Order ID
```

### Flow 6 — View Orders
```
Hover over name → Click "My Orders"
→ GET /api/orders/user/{userId}
→ Shows all orders with:
   - Order ID and date
   - Items with images
   - Total amount
   - Status badge (PENDING/CONFIRMED/SHIPPED/DELIVERED)
```

---

## 11. DATABASE DESIGN DECISIONS

| Service | Database | Reason |
|---------|----------|--------|
| User | MySQL | Structured auth data, ACID needed for security |
| Product | MongoDB | Flexible schema for varying product attributes |
| Order | MySQL | ACID transactions, relational (order→items) |
| Cart | MongoDB | Temporary data, embedded docs = fast reads |
| Payment | MySQL | Financial data needs ACID, audit trail |

---

## 12. WHY EUREKA SERVER

**Problem without Eureka**:
- Services use hardcoded URLs (localhost:8081, localhost:8082 etc.)
- If a service moves to a different port or server, everything breaks
- No way to know which services are UP or DOWN

**Solution with Eureka**:
- Every service registers itself with name + address
- Services discover each other by name (not hardcoded URL)
- Eureka dashboard shows real-time health of all services
- If a service goes down, Eureka removes it from registry

**Why it failed initially**:
- Eureka SERVER was never created — only clients existed
- All services tried to connect to `http://localhost:8761/eureka/`
- Nothing was running there → `Connection refused` errors
- Fix: Created `eureka-server` project with `@EnableEurekaServer`
- Rule: **Eureka Server must ALWAYS start before all other services**

---

## 13. COMMON ISSUES & FIXES

| Issue | Cause | Fix |
|-------|-------|-----|
| "Email already registered" | Using same email twice | Use different email or login |
| Port already in use | Previous run still active | Kill process: `taskkill /F /PID <pid>` |
| Products not showing | Product service down | Restart port 8082 |
| Cart not updating | User not logged in | Login first |
| Eureka shows EMERGENCY warning | Low heartbeat count | Normal in dev, ignore it |
| Dropdown disappears | CSS hover gap issue | Fixed — hover anywhere on menu |
| "Creating..." stuck | Backend error | Check user-service terminal logs |
| MongoDB connection failed | MongoDB service stopped | Start MongoDB from services.msc |
| MySQL access denied | Wrong password | Password is Root@1234 |

---

## 14. HOW TO STOP ALL SERVICES

Press `Ctrl+C` in each terminal window to stop:
1. Frontend (React)
2. Payment Service
3. Cart Service
4. Order Service
5. Product Service
6. User Service
7. Eureka Server (stop last)

---

## 15. HOW TO RESTART EVERYTHING

```bash
# Terminal 1 - Eureka (ALWAYS FIRST)
cd /d F:\flipkart-clone\eureka-server && mvn spring-boot:run

# Terminal 2 - User Service
cd /d F:\flipkart-clone\user-service && mvn spring-boot:run

# Terminal 3 - Product Service
cd /d F:\flipkart-clone\product-service && mvn spring-boot:run

# Terminal 4 - Order Service
cd /d F:\flipkart-clone\order-service && mvn spring-boot:run

# Terminal 5 - Cart Service
cd /d F:\flipkart-clone\cart-service && mvn spring-boot:run

# Terminal 6 - Payment Service
cd /d F:\flipkart-clone\payment-service && mvn spring-boot:run

# Terminal 7 - Frontend
cd /d F:\flipkart-clone\frontend && npm start
```

---

## 16. QUICK TEST CHECKLIST

After starting everything, test in this order:

- [ ] Open http://localhost:3000 — homepage loads
- [ ] Open http://localhost:8761 — Eureka shows 5 services UP
- [ ] Register new account
- [ ] Login with that account
- [ ] Add a product (Account Menu → Add Product)
- [ ] Search for the product
- [ ] Click product → view details
- [ ] Add to cart → cart count increases
- [ ] Go to cart → items visible
- [ ] Checkout → enter address → choose payment → place order
- [ ] View in My Orders → order visible with PENDING status
