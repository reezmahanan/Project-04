# Project 4: Frontend & Backend Integration (STYLEO Ceylon)

### Student Information
- **Name:** M. Reezma Hanan
- **Module:** IT2308 - Web Application Development (Project 4: Full-Stack Integration)
- **GitHub Repository:** [https://github.com/reezmahanan/Project-04](https://github.com/reezmahanan/Project-04)

---

## 📌 Project Overview
This project is the **Full-Stack Mastery Phase ("The Unified System")** for the **STYLEO Ceylon** e-commerce platform.

In previous phases, each component was developed in isolation:
* **Project 1:** Responsive UI (*"The Skin"*)
* **Project 2:** Backend REST API (*"The Nervous System"*)
* **Project 3:** Relational MySQL Database (*"The Vault"*)

**Project 4 bridges the synaptic gap**, bringing all three tiers into a unified, high-performance web application. The frontend interface communicates asynchronously with the backend using modern `async / await` and native `fetch()`, persisting data directly into MySQL via ACID transactions.

---

## 🏛️ Full-Stack I-P-O Architecture (Input-Process-Output)

```text
[ CLIENT (Browser) ]                     [ SERVER (Express.js) ]                 [ DATABASE (MySQL) ]
  Stage 1: Input                           Stage 2: Process                        State Persistence
  ----------------                         -----------------                       ------------------
  User adds item &                         Express Router receives                 Relational Query
  clicks "Place Order"                     POST /api/orders                        BEGIN TRANSACTION;
         │                                         │                               INSERT INTO customers...
         │  ── fetch(POST, JSON Payload) ──►       │ ── Parameterized SQL Query ─► INSERT INTO orders...
         │                                         │                               INSERT INTO order_items...
         │                                         │ ◄─ Transaction Commit ─────── COMMIT;
         │  ◄── 201 Created (JSON Response) ────── │
         ▼
  Stage 3: Output
  ----------------
  DOM updates live with
  courier tracking code:
  "DOMEX-LK-XXXXX"
```

---

## 🛡️ Senior Engineering Patterns Implemented

1. **Modern `async / await` with Native `fetch()`:**
   - Avoids callback and promise hell. Pauses function execution cleanly without freezing the single-threaded browser UI thread.
2. **Defensive Programming with `try / catch / finally`:**
   - **No Silent Failures:** Network and server exceptions are captured and displayed to the user via toast notifications.
   - **Explicit `response.ok` Checks:** Evaluates HTTP status codes (`2xx`) before parsing JSON, preventing unhandled 4xx/5xx crashes.
   - **The `finally` Block:** Re-enables submission buttons and cleans up loading states regardless of success or failure.
3. **CORS (Cross-Origin Resource Sharing):**
   - Configured on the Express backend to allow seamless cross-network communication.
4. **Graceful Degradation:**
   - If the backend database server is temporarily offline, the frontend seamlessly falls back to cached data with an informative message.

---

## 📁 Project Structure

```text
Project 4/
├── client/                     # Frontend (Sensory Interface)
│   ├── index.html              # Clean semantic HTML markup
│   ├── style.css               # Responsive design & modern UI styling
│   └── app.js                  # Integrated async/await fetch client engine
├── server/                     # Backend (Cognitive Vault)
│   ├── database/
│   │   ├── schema.sql          # Relational SQL schema
│   │   ├── db.js               # mysql2 connection pool
│   │   └── seed.js             # Initial catalog seeder
│   ├── routes/
│   │   ├── productRoutes.js    # Products CRUD endpoints
│   │   ├── orderRoutes.js      # Orders transactional endpoints
│   │   └── customerRoutes.js   # Customer endpoints
│   ├── middleware/
│   │   ├── validator.js        # Input validation middleware
│   │   └── errorHandler.js     # Centralized 404 & 500 error handler
│   ├── server.js               # Unified Express server
│   ├── .env                    # MySQL database configuration
│   └── .env.example
├── package.json                # Single npm run launcher
└── README.md                   # Full-stack documentation
```

---

## 🚀 How to Run the Unified Full-Stack Application

1. **Clone the repository:**
   ```bash
   git clone https://github.com/reezmahanan/Project-04.git
   cd Project-04
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify/Seed the Database:**
   ```bash
   npm run seed
   ```

4. **Start the Unified Server:**
   ```bash
   npm start
   ```

5. **Open in Browser:**
   - **Web Application (Frontend + Backend):** [http://localhost:5000](http://localhost:5000)
   - **REST API Health Check:** [http://localhost:5000/api](http://localhost:5000/api)
   - **Live Products from Database:** [http://localhost:5000/api/products](http://localhost:5000/api/products)

---

## 👤 Author
- **M. Reezma Hanan**
- GitHub: [@reezmahanan](https://github.com/reezmahanan)
