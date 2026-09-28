# BlossomGlow Candle Creations E-Commerce

Full-Stack E-Commerce Platform featuring an artisan React + TypeScript frontend and a Spring Boot 3 + Java 21 REST API backend.

---

## 📁 Project Structure

```
blossomglow-ecommerce/
├── pom.xml                <-- Root Maven Parent POM (aggregates backend module)
├── package.json           <-- React Frontend dependencies & scripts
├── backend/               <-- Spring Boot 3 + Java 21 REST API
│   ├── pom.xml            <-- Backend Maven configuration
│   └── src/               <-- Java Controllers, Services, Repositories
├── src/                   <-- React SPA Components, State, & Styles
└── public/                <-- Static Assets & Artisan Video
```

---

## 🚀 How to Run

### 1. Run the Java Spring Boot Backend (Port 8080)
You can run it in two ways:

**Option A (From the root folder):**
```bash
mvn clean compile -pl backend
mvn spring-boot:run -pl backend
```

**Option B (From the `backend` folder):**
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

Once running:
- **API Base**: `http://localhost:8080/api`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`

---

### 2. Run the React Frontend (Port 3000)
From the root folder (`blossomglow-ecommerce`):
```bash
# Install Node dependencies
npm install

# Start local Vite dev server
npm run dev
```

Open your browser at `http://localhost:3000`.
