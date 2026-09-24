# BlossomGlow Candle Creations - Java 21 & Spring Boot Backend

Production REST API backend for BlossomGlow Candle Creations, built with **Java 21**, **Spring Boot 3.3.4**, **Spring Data JPA**, **MySQL**, **Spring Security**, and **Bean Validation**.

---

## 🛠️ Technology Stack
- **Java**: Version 21 (Virtual Threads enabled for ultra-high concurrency)
- **Framework**: Spring Boot 3.3.4 (Spring Web, Spring Security, Spring Data JPA)
- **Database**: MySQL 8.0+
- **Build Tool**: Apache Maven 3.9+
- **Authentication**: HTTP Basic & Role-Based Access Control (RBAC)

---

## 🗄️ MySQL Database Setup
1. Create the MySQL database:
```sql
CREATE DATABASE IF NOT EXISTS blossomglow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Configure your credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blossomglow_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

3. Tables and initial flagship product seeds will automatically be loaded from `schema.sql` and `data.sql` on startup (`spring.sql.init.mode=always`).

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

---

## 🔗 Connecting with React Frontend
In your React `.env` file (root folder):
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 📡 Core REST API Endpoints

### Storefront APIs (Public)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products with filtering (`category`, `fragranceFamily`, `search`) |
| `GET` | `/api/products/{id}` | Get product details by ID |
| `GET` | `/api/products/search?keyword=lotus` | Search products across names, notes & stories |
| `GET` | `/api/categories` | List all candle collections & categories |
| `GET` | `/api/cart` | Get current customer's cart (by `X-Session-Token` header) |
| `POST` | `/api/cart` | Add product to cart with vessel & wick variants |
| `PUT` | `/api/cart/{id}` | Update quantity of a cart item |
| `DELETE` | `/api/cart/{id}` | Remove item from cart |
| `POST` | `/api/orders` | Checkout and place new order |
| `GET` | `/api/orders/track/{orderNumber}` | Track live order status & BlueDart courier |
| `POST` | `/api/contact` | Submit contact inquiry or custom hamper request |

### Admin APIs (Protected: `ROLE_ADMIN`)
Credentials: `admin` / `blossomglow2026!`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/products` | Create a new candle creation |
| `PUT` | `/api/products/{id}` | Update existing product details, price, or stock |
| `DELETE` | `/api/products/{id}` | Remove a product |
| `GET` | `/api/orders` | View all customer orders |
| `PUT` | `/api/orders/{id}/status` | Update order status (`Pending`, `Confirmed`, `Preparing`, `Shipped`, `Delivered`, `Cancelled`) |
| `GET` | `/api/admin/metrics` | View dashboard sales analytics and low stock alerts |
