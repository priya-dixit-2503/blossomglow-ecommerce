# BlossomGlow Candle Creations - Java 21 & Spring Boot Backend

Production REST API backend for BlossomGlow Candle Creations, built with **Java 21**, **Spring Boot 3.3.4**, **Spring Data JPA**, **MySQL**, **Spring Security with JWT**, **Swagger / OpenAPI 3**, and **Bean Validation**.

---

## 🛠️ Technology Stack
- **Java**: Version 21 (Virtual Threads enabled for high concurrency)
- **Framework**: Spring Boot 3.3.4 (Spring Web, Spring Security, Spring Data JPA, Bean Validation)
- **Database**: MySQL 8.0+
- **Build Tool**: Apache Maven 3.9+
- **Authentication**: JWT (JSON Web Tokens) with JJWT + Spring Security RBAC (`ROLE_CUSTOMER`, `ROLE_ADMIN`)
- **API Documentation**: SpringDoc OpenAPI 3 / Swagger UI 2.6.0

---

## 🗄️ MySQL Database Setup
1. Create the MySQL database:
```sql
CREATE DATABASE IF NOT EXISTS blossomglow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Environment Variables & Credentials:
No secrets are hardcoded! Configure in your environment or in `.env` / `src/main/resources/application.properties`:
```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/blossomglow_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="YOUR_MYSQL_PASSWORD"
export JWT_SECRET="blossomglowSecretKey2026MustBeAtLeast32BytesLongForHmacSha256!"
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="blossomglow2026!"
```

3. Tables and initial seeds will automatically be loaded from `schema.sql` and `data.sql` on startup (`spring.sql.init.mode=always`).

---

## 🚀 Running the Backend
From the `/backend` directory:
```bash
# Clean & Compile
mvn clean compile

# Run Spring Boot
mvn spring-boot:run
```
The REST API server will start on `http://localhost:8080`.

### 📖 Interactive Swagger / OpenAPI Documentation
Once started, open your browser:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON Spec**: `http://localhost:8080/v3/api-docs`

---

## 🔗 Connecting with React Frontend
In your React `.env` file (root folder):
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 📡 Core REST API Endpoints

### 1. Authentication APIs
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Log in as Customer or Admin, returns Bearer JWT token |
| `POST` | `/api/auth/register` | Register new customer account with BCrypt password |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile |

### 2. Storefront APIs (Public)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get products with filters (`category`, `fragranceFamily`, `search`) |
| `GET` | `/api/products/{id}` | Get product details by ID |
| `GET` | `/api/categories` | List candle collections & categories |
| `GET` | `/api/reviews/product/{id}` | Get verified customer reviews for a product |
| `POST` | `/api/reviews` | Submit a customer rating and review |
| `GET` | `/api/cart` | Get cart items (via `X-Session-Token` header) |
| `POST` | `/api/cart` | Add product to cart with vessel & wick variants |
| `PUT` | `/api/cart/{id}` | Update quantity of a cart item |
| `DELETE` | `/api/cart/{id}` | Remove item from cart |
| `POST` | `/api/orders` | Checkout and place new order |
| `GET` | `/api/orders/track/{orderNumber}` | Track live order status & BlueDart courier |
| `POST` | `/api/contact` | Submit contact inquiry or custom hamper request |

### 3. Admin APIs (Protected: Requires Bearer JWT with `ROLE_ADMIN`)
Default master credentials: `admin` / `blossomglow2026!`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/products` | Create a new candle creation |
| `PUT` | `/api/products/{id}` | Update existing product details, price, or stock |
| `DELETE` | `/api/products/{id}` | Remove a product |
| `GET` | `/api/orders` | View all customer orders |
| `PUT` | `/api/orders/{id}/status` | Update order status (`Pending`, `Confirmed`, `Preparing`, `Shipped`, `Delivered`, `Cancelled`) |
| `GET` | `/api/admin/metrics` | View dashboard revenue, orders, and low-stock alerts |
