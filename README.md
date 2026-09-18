# STYLEO Ceylon — Unified Full-Stack E-Commerce Web Application
### Project 4: Full-Stack Frontend & Backend Integration ("The Unified System")

---

## 👨‍🎓 Student & Module Information

| Field | Details |
| :--- | :--- |
| **Student Name** | **M. Reezma Hanan** |
| **Module Code & Title** | **IT2308 — Web Application Development** |
| **Assessment Title** | **Project 4: Full-Stack Integration (Final Capstone Phase)** |
| **Academic Specialization** | **BSc (Hons) in Information Technology / Software Engineering** |
| **GitHub Repository** | [https://github.com/reezmahanan/Project-04](https://github.com/reezmahanan/Project-04) |
| **Application Architecture** | **3-Tier Full-Stack (Vanilla JS Client + Node/Express API + MySQL 8 Database)** |
| **Local Runtime Port** | `http://localhost:5000` |

---

## 📌 1. Executive Project Summary

**STYLEO Ceylon** is a high-performance, responsive e-commerce web platform designed for premium fashion, apparel, footwear, artisanal bags, and gemstones in Sri Lanka. 

Prior to this phase, the application tiers were developed independently as educational milestones:
* **Project 1 (The Sensory Interface):** Responsive, mobile-first frontend user interface built with semantic HTML5 and modern CSS3.
* **Project 2 (The Nervous System):** Express.js RESTful API handling HTTP routing, request parsing, and business logic validation.
* **Project 3 (The Cognitive Vault):** Relational MySQL database schema ensuring ACID transactional persistence, relational integrity, and normalization.

**Project 4 represents the Full-Stack Mastery Phase ("The Unified System").** It unites all three isolated tiers into a cohesive, production-grade web application. The single-page JavaScript frontend communicates asynchronously with the Express backend using modern `async / await` and native `fetch()` calls, persisting orders and customer information into a live MySQL relational database with ACID guarantees.

---

## 🏛️ 2. The 4-Stage Progressive Development Journey

```text
┌───────────────────────────┐      ┌───────────────────────────┐
│  PROJECT 1: "THE SKIN"    │      │  PROJECT 2: "THE NERVES"  │
│  - Semantic HTML5 Markup  │      │  - Node.js & Express.js   │
│  - Responsive CSS3 Layout │      │  - RESTful API Endpoints  │
│  - Interactive DOM Events │      │  - Validation Middleware  │
└─────────────┬─────────────┘      └─────────────┬─────────────┘
              │                                  │
              └─────────────────┬────────────────┘
                                │
                   ┌────────────▼──────────────┐
                   │   PROJECT 3: "THE VAULT"  │
                   │   - Relational MySQL 8    │
                   │   - Normalized Schema DDL │
                   │   - Foreign Key Cascades  │
                   └────────────┬──────────────┘
                                │
     ╔══════════════════════════▼══════════════════════════╗
     ║        PROJECT 4: "THE UNIFIED LIVING SYSTEM"       ║
     ║  - Seamless Asynchronous fetch() & async/await      ║
     ║  - Express Serves Both Frontend & REST API Server   ║
     ║  - ACID Transactional Checkout & Order Tracking     ║
     ║  - Auto-Schema Initialization & Self-Seeding DB     ║
     ╚═════════════════════════════════════════════════════╝
```

---

## 📐 3. System Architecture & Input-Process-Output (I-P-O) Flow

The application follows a standard **3-Tier Client-Server-Database Architecture**:

```text
[ BROWSER (Presentation Layer) ]
  ├── Semantic HTML5 DOM
  ├── Modular CSS3 Stylesheet
  └── Vanilla JavaScript Engine (async/await, native fetch)
               │
               ▼  HTTP / REST (JSON Payloads via Port 5000)
[ EXPRESS.JS SERVER (Application / Middleware Layer) ]
  ├── CORS Preflight & Security Headers
  ├── Static File Server (serves /client directory)
  ├── Request Validation Middleware ("Gatekeeper Rule")
  ├── REST Routers: /api/products, /api/orders, /api/customers
  └── Centralized Error Handling (404 & 500 JSON handlers)
               │
               ▼  mysql2/promise Connection Pool (TCP Port 3306)
[ MYSQL 8 (Persistence / Database Layer) ]
  ├── customers Table
  ├── products Table
  ├── orders Table (with DOMEX-LK-XXXXX tracking)
  └── order_items Table (Composite Foreign Keys)
```

---

## 🗄️ 4. Relational Database Design (MySQL 8)

The relational schema strictly satisfies **Third Normal Form (3NF)**, avoiding data redundancy and update anomalies.

### Database Tables Specification & Constraints

1. **`customers` Table:** Stores unique customer profiles. Enforces unique constraint on `email`.
   * Columns: `id` (INT PK AI), `name` (VARCHAR), `email` (VARCHAR UK), `phone` (VARCHAR), `address` (TEXT), `city` (VARCHAR), `district` (VARCHAR), `created_at` (TIMESTAMP).
2. **`products` Table:** Master catalog storing prices, regular prices, ratings, and stock levels.
   * Columns: `id` (INT PK AI), `name` (VARCHAR), `category` (VARCHAR), `price` (DECIMAL), `regular_price` (DECIMAL), `rating` (DECIMAL), `reviews_count` (INT), `badge` (VARCHAR), `img` (TEXT), `in_stock` (BOOLEAN), `stock_count` (INT).
3. **`orders` Table:** Stores header information for each transaction. Connected to `customers(id)` with `ON DELETE CASCADE`.
   * Columns: `id` (INT PK AI), `tracking_id` (VARCHAR UK), `customer_id` (INT FK), `subtotal` (DECIMAL), `delivery_fee` (DECIMAL), `total` (DECIMAL), `payment_method` (VARCHAR), `status` (VARCHAR), `courier` (VARCHAR).
4. **`order_items` Table:** Junction table resolving the Many-to-Many relationship between orders and products.
   * Columns: `id` (INT PK AI), `order_id` (INT FK CASCADE), `product_id` (INT FK RESTRICT), `quantity` (INT), `unit_price` (DECIMAL).

### Self-Initializing & Auto-Seeding Feature (`db.js`)
When the Express application boots, `initDatabase()` automatically executes `CREATE TABLE IF NOT EXISTS` for all 4 tables and checks if the products table is populated. If empty, it **automatically seeds all 16 catalog items** into MySQL without requiring manual SQL commands.

---

## 📡 5. RESTful API Endpoint Specification

All endpoints follow strict REST conventions: **Resources are Nouns**, **HTTP Methods are Verbs**, and responses are standardized JSON payloads.

| HTTP Method | Endpoint URI | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api` | Root API Health Check & System Status | `200 OK` |
| `GET` | `/api/products` | Retrieve all products (supports `?category=` filter) | `200 OK`, `500 Error` |
| `GET` | `/api/products/:id` | Retrieve single product details by primary key | `200 OK`, `404 Not Found` |
| `POST` | `/api/products` | Add a new product to catalog (requires validation) | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/products/:id` | Update product details, price, or stock count | `200 OK`, `404 Not Found` |
| `DELETE` | `/api/products/:id` | Remove a product from the catalog | `200 OK`, `404 Not Found` |
| `GET` | `/api/orders` | List all orders with customer details & items | `200 OK`, `500 Error` |
| `GET` | `/api/orders/:trackingId` | Query specific order status by tracking number | `200 OK`, `404 Not Found` |
| `POST` | `/api/orders` | Place a new transactional multi-item order | `201 Created`, `400 Bad Request` |
| `GET` | `/api/customers` | Query registered customer directory | `200 OK`, `500 Error` |

---

## 💻 6. Frontend Engine Architecture (`client/app.js`)

The client application is built with modern, dependency-free **Vanilla JavaScript (ES6+)**:

* **Asynchronous `fetch()` Calls:** Every network request is handled with `async / await` wrapped in defensive `try / catch / finally` blocks, ensuring the single-threaded browser UI thread never freezes.
* **Cart State Management:** The shopping cart is managed via an in-memory array and synchronized with browser `localStorage`, ensuring items persist across page refreshes.
* **Live DOM Injection:** Clean template literals render product cards, subtotal sums, item counts, and status indicators without bulky frontend frameworks.
* **Order Tracking Dialog:** Customers can enter their tracking code (e.g. `DOMEX-LK-89421`) at any time to inspect live courier progress, items purchased, and delivery address.
* **Graceful Degradation:** If the backend database server is momentarily unreachable, the UI gracefully defaults to an internal catalog fallback with a non-intrusive warning toast.

---

## 🛡️ 7. Senior Engineering & Security Patterns

1. **Defense Against SQL Injection (Parameterized Queries):**
   * Raw user inputs are **never** concatenated directly into SQL strings.
   * All database operations utilize MySQL prepared statements (`connection.execute(query, [params])`) which separate SQL logic from user data.
2. **The "Never Trust the Client" Rule (Input Validation):**
   * All incoming data is validated syntactically (data types, presence) and semantically (positive numbers, valid email formatting, non-empty shopping carts) before touching the database.
3. **Cross-Origin Resource Sharing (CORS):**
   * Configured via Express CORS middleware to regulate allowed origins and HTTP verbs.
4. **Environment Isolation (`.env`):**
   * Sensitive credentials (MySQL root password, database ports, host IPs) are isolated in `.env` files and excluded from Git commits via `.gitignore`. An `.env.example` template is provided for production deployments.
5. **Centralized Error Handling:**
   * Handlers intercept unhandled routes (`404 Not Found`) and unexpected server exceptions (`500 Internal Server Error`), returning uniform JSON error responses rather than crashing the Node process.

---

## 📂 8. Project File Structure

```text
Project 4/
├── client/                              # Presentation Tier (Frontend)
│   ├── index.html                       # Semantic HTML5 UI layout
│   ├── style.css                        # Modern responsive CSS3 styling
│   └── app.js                           # Asynchronous fetch client engine
├── server/                              # Logic & Persistence Tiers (Backend)
│   ├── database/
│   │   ├── db.js                        # mysql2 connection pool & auto-seeder
│   │   ├── schema.sql                   # Relational DDL schema script
│   │   └── seed.js                      # Standalone CLI seeder script
│   ├── middleware/
│   │   ├── validator.js                 # Input validation middleware
│   │   └── errorHandler.js              # Centralized 404 & 500 error handlers
│   ├── routes/
│   │   ├── productRoutes.js             # Products REST endpoints
│   │   ├── orderRoutes.js               # Transactional orders REST endpoints
│   │   └── customerRoutes.js            # Customer directory endpoints
│   ├── server.js                        # Unified Express entry point
│   ├── .env                             # Active database environment variables
│   └── .env.example                     # Environment template for deployment
├── .gitignore                           # Git exclusion rules (node_modules, .env)
├── package.json                         # Project metadata, dependencies & scripts
├── package-lock.json                    # Deterministic dependency lockfile
└── README.md                            # Comprehensive project documentation
```

---

## 🚀 9. Step-by-Step Installation & Local Setup

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **MySQL Server:** v8.0 or MariaDB v10.5+ running on port `3306`

### 1. Clone the Repository
```bash
git clone https://github.com/reezmahanan/Project-04.git
cd Project-04
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Database Credentials
Create a `.env` file in the `server/` directory (or use the existing template):
```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=styleo_db
```

### 4. Create the Database in MySQL
```sql
CREATE DATABASE IF NOT EXISTS styleo_db;
```

### 5. Start the Unified Application
```bash
npm start
```
*(The server will automatically connect to MySQL, create all tables, and seed the initial 16 products if empty!)*

### 6. Access in Browser
* **Web Application:** [http://localhost:5000](http://localhost:5000)
* **API Health Check:** [http://localhost:5000/api](http://localhost:5000/api)
* **Products Endpoint:** [http://localhost:5000/api/products](http://localhost:5000/api/products)

---

## ☁️ 10. Cloud Deployment (Railway.app)

The project is pre-configured for automated CI/CD deployment on **[Railway.app](https://railway.com)**:

1. **Deploy Repository:** Connect `reezmahanan/Project-04` on Railway.
2. **Provision MySQL:** Add a MySQL database service inside the Railway project.
3. **Link Variables:** Under the `Project-04` service ➔ **Variables** tab, map:
   * `DB_HOST` = `${{MySQL.MYSQLHOST}}`
   * `DB_PORT` = `${{MySQL.MYSQLPORT}}`
   * `DB_USER` = `${{MySQL.MYSQLUSER}}`
   * `DB_PASSWORD` = `${{MySQL.MYSQLPASSWORD}}`
   * `DB_NAME` = `${{MySQL.MYSQLDATABASE}}`
4. **Generate Domain:** Under **Settings** ➔ **Networking**, click **Generate Domain**.
5. The application boots and self-seeds automatically on the cloud!

---

## 🧪 11. Testing & Quality Assurance Verification

| Test ID | Test Scenario | Input Data | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Fetch Catalog via API | `GET /api/products` | Returns HTTP 200 with 16 product JSON objects | **PASS** |
| **TC-02** | Filter Catalog by Category | `GET /api/products?category=blazers` | Returns only products matching `category = 'blazers'` | **PASS** |
| **TC-03** | Prevent Empty Checkout | `POST /api/orders` with empty items `[]` | Returns HTTP 400 with `"Shopping cart is empty"` | **PASS** |
| **TC-04** | Prevent SQL Injection | Malicious input `' OR '1'='1` in email field | Sanitized via parameterized query; rejects invalid format | **PASS** |
| **TC-05** | Atomic Multi-Item Order | Complete order payload with 2 items | Inserts Customer, Order, and 2 Order Items in a single ACID transaction | **PASS** |
| **TC-06** | Courier Tracking Lookup | `GET /api/orders/DOMEX-LK-89421` | Returns HTTP 200 with complete customer, courier, and items details | **PASS** |

---

## 🎓 12. Key Learning Outcomes & Competencies Demonstrated

* **Architectural Unification:** Successfully converged disparate frontend, API, and relational database modules into a cohesive full-stack web application.
* **ACID Transaction Management:** Implemented atomic database transactions (`BEGIN`, `COMMIT`, `ROLLBACK`) across multi-table relationships to ensure zero data corruption during checkout.
* **Asynchronous Web Programming:** Mastered `async / await` and native `fetch()` for non-blocking UI rendering and clean network communication.
* **API Security Standards:** Applied the "Never Trust the Client" paradigm through parameterized prepared queries, server-side data validation, and sanitized JSON responses.
* **DevOps & Cloud Deployment:** Configured environment isolation and automated CI/CD deployment pipelines on Railway.app.

---

## 👤 Author & Acknowledgements

* **Developer:** M. Reezma Hanan
* **GitHub Profile:** [@reezmahanan](https://github.com/reezmahanan)
* **Institution:** Department of Information Technology & Computing
* **Coursework:** IT2308 Web Application Development — DecodeLabs Industrial Project Series

---
*STYLEO Ceylon © 2026. All rights reserved.*
