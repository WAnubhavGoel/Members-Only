# 🗝️ Members Only

A production-ready, full-stack clubhouse application where registered users post messages, and verified club members unlock access to secret information (message authors and post timestamps). 

This project demonstrates clean architecture patterns, secure session-based authentication using **Passport.js**, database abstraction with **Prisma ORM**, and a responsive frontend built on **React** and **Vite**.

---

## 🏗️ Architecture & System Design

The application utilizes a split client-server architecture with stateful session tracking persisted directly in the relational database.

```mermaid
graph TD
    Client[React Frontend] <-->|HTTP / Credentials| Express[Express Server]
    Express <-->|Passport.js Local Strategy| SessionStore[PrismaSessionStore]
    Express <-->|Queries| Prisma[Prisma ORM]
    Prisma <-->|Connection Pool| PostgreSQL[(PostgreSQL Database)]
    SessionStore <--> PostgreSQL
```

### Technical Stack
* **Frontend**: React (Vite-powered SPA), React Router v7, Axios, Vanilla CSS (custom responsive design system)
* **Backend**: Express 5 (Node.js, ES Modules), Passport.js (Local Session Auth), Bcrypt.js, Express Validator
* **Database & ORM**: Prisma ORM, PostgreSQL (via Neon Serverless / pg driver adapter)

---

## 🔒 Security & Access Control

The core feature of **Members Only** is its hierarchical permissions and role-based data obfuscation. Depending on the client's authentication and membership status, data is dynamically sanitized before leaving the server.

### Permission Matrix

| Action | Anonymous Guest | Registered User | Clubhouse Member | Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Read Messages** | ✅ (Obfuscated) | ✅ (Obfuscated) | ✅ (Full Data) | ✅ (Full Data) |
| **Post Messages** | ❌ | ✅ | ✅ | ✅ |
| **Join Club (Passcode)** | ❌ | ✅ | ✅ (Already In) | ✅ |
| **Delete Messages** | ❌ | ❌ | ❌ | ✅ |

> [!NOTE]
> **Data Obfuscation Layer**: For guests and standard registered users, the backend intercepts the message payloads and maps the author to `Anonymous Member` and the post date to `Hidden`. This sanitization occurs at the database/controller level, preventing sensitive info from reaching the client network layer.

> [!TIP]
> **Try It Out**: To test the membership upgrade functionality, you can enter the passcode **`iamamember`** on the "Join Club" page to unlock real author profiles and post timestamps.

---

## 🗄️ Database Schema

Managed via **Prisma ORM** with automated migrations. The database holds three core tables: `User`, `Message`, and `Session` (used for session-store persistence).

```mermaid
erDiagram
    User {
        Int id PK
        String firstName
        String lastName
        String email UK
        String password
        Boolean membership
        Boolean isAdmin
        DateTime createdAt
    }
    Message {
        Int id PK
        Int authorId FK
        String title
        String body
        DateTime createdAt
    }
    Session {
        String id PK
        String sid UK
        String data
        DateTime expiresAt
    }
    User ||--o{ Message : "posts"
```

---

## 🔌 API Endpoints Reference

All API endpoints are prefixed with `/api` and return standardized JSON responses.

### Authentication (`/api/auth`)

* **`POST /sign-up`**
  * Registers a new user account, hashes the password using Bcrypt, auto-logs the user in, and establishes a session.
  * *Request Body*:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "password": "securepassword123",
      "isAdmin": false
    }
    ```
* **`POST /login`**
  * Authenticates user using the passport-local strategy.
  * *Request Body*:
    ```json
    {
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```
* **`GET /status`**
  * Verifies current session validity and returns authenticated user details.
* **`POST /logout`**
  * Terminates the current session and clears the client cookies.

### Users (`/api/users`)

* **`POST /join`** (Auth Required)
  * Upgrades user status to `membership: true` if the correct secret passcode is provided.
  * *Request Body*:
    ```json
    {
      "passcode": "iamamember"
    }
    ```

### Messages (`/api/messages`)

* **`GET /`**
  * Returns list of all posts. Sanitizes data conditionally if user is not a member or admin.
* **`POST /new`** (Auth Required)
  * Creates a new message linked to the logged-in user.
  * *Request Body*:
    ```json
    {
      "title": "My Post Title",
      "body": "This is the body content."
    }
    ```
* **`DELETE /:id`** (Admin Required)
  * Deletes a specific message by its integer ID.

---

## 🚀 Installation & Local Setup

Follow these steps to run the development environment locally.

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A running [PostgreSQL](https://www.postgresql.org/) database instance

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up local environment variables. Create a `.env` file in the `backend/` root:
   ```env
   # Database connection string
   DATABASE_URL="postgresql://user:password@localhost:5432/members_only?schema=public"

   # Express Session Secret
   SECRET="your_session_secret_key"

   # Club Admission Passcode (Default: "iamamember")
   SECRET_PASSCODE="iamamember"

   # CORS Allow Origin
   FRONTEND_URL="http://localhost:5173"

   # Server Port
   PORT=3000
   ```
4. Run Prisma database migrations to create tables:
   ```bash
   npx prisma migrate dev
   ```
5. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```
6. Start the Express server:
   ```bash
   node app.js
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up client environment variables. Create a `.env` file in the `frontend/` root:
   ```env
   VITE_API_URL="http://localhost:3000/api"
   ```
4. Launch the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🛠️ Key Design & Code Patterns

### Database Connection Safety
Prisma client initialization uses a separate connection pool mapping via `@prisma/adapter-pg`. This allows robust connection scaling and handles client instantiation cleanly in serverless or traditional environments:
```javascript
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
```

### Production Security Configurations
* **Session Persistence**: Sessions are saved directly to PostgreSQL via `@quixo3/prisma-session-store` rather than local memory, protecting active user logins from backend server restarts.
* **Cookie Protection**: Cookies are generated with strict defaults:
  ```javascript
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 Week
    httpOnly: true,                  // Mitigates XSS cookie theft
    secure: isProduction,            // HTTPS only in prod
    sameSite: isProduction ? 'none' : 'lax'
  }
  ```
* **Reverse Proxy Trust**: The backend configuration respects upstream reverse proxies (like Nginx, Fly.io, or Render load balancers) when evaluating TLS termination:
  ```javascript
  if (process.env.NODE_ENV === "production") {
      app.set("trust proxy", 1);
  }
  ```

---

## 📈 Future Roadmap & Enhancements
1. **Validation Middleware Implementation**: Refine backend input bounds check inside `/sign-up` and `/new` routes with Express Validator.
2. **Interactive Admin Dashboards**: Build visual dashboards on the frontend for Admins to view user activity statistics and run bulk moderations.
3. **Password Complexity Constraints**: Elevate client and server-side rules for registration password entropy.