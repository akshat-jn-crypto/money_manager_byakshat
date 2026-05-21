# 💰 Expense Management System

A full-stack **MERN** (MongoDB, Express, React, Node.js) personal-finance app.
Users can register/log in, record income & expense transactions, filter them by
date range and type, and view analytics (income vs. expense breakdowns and
category-wise spending).

**Live app:** https://money-manager-byakshat.vercel.app

---

## Architecture

The app is split into three independently-hosted pieces:

```
   ┌──────────────────┐      HTTPS / JSON       ┌──────────────────┐     Mongoose      ┌──────────────────┐
   │     Browser      │  ───────────────────►   │   Express API    │  ───────────────► │   MongoDB Atlas  │
   │  React (CRA) +   │     /api/v1/...         │    (Node.js)     │     (driver)      │   (cloud DB)     │
   │   Ant Design     │  ◄───────────────────   │                  │  ◄─────────────── │                  │
   └──────────────────┘                         └──────────────────┘                   └──────────────────┘
        Vercel                                        Render                              MongoDB Atlas
   (frontend hosting)                            (backend hosting)                      (database hosting)
```

- **Frontend (`client/`)** — a Create React App SPA. All API calls go through a
  single axios instance whose `baseURL` is set in `client/src/index.js`:
  - In production it defaults to the deployed Render backend.
  - For local dev, set `REACT_APP_API_URL` (see below) to point at your local API.
- **Backend (`backend/`)** — an Express server. All routes are mounted under
  **`/api/v1`** and are split into two domains: `users` (auth) and
  `transections` (transactions). It talks to MongoDB via Mongoose.
- **Database** — MongoDB Atlas (cloud). The backend connects using the
  `MONGO_URL` connection string.

> Note: the frontend and backend are deployed **separately** (Vercel + Render),
> so the frontend must call the backend by its absolute URL. The CRA `proxy`
> field only works during local development and is **not** used in production.

### Request flow (example: login)

1. React posts to `/api/v1/users/login` (axios prepends the backend `baseURL`).
2. Express routes it to `userController.loginController`.
3. Mongoose queries MongoDB Atlas for a matching user.
4. JSON response flows back; on success the user is stored in `localStorage`
   and `ProtectedRoutes` lets them into the dashboard.

---

## Tech stack

| Layer     | Technology                                                        |
| --------- | ----------------------------------------------------------------- |
| Frontend  | React 18 (CRA), Ant Design, React Router, axios, moment, Bootstrap |
| Backend   | Node.js (22.x), Express, Mongoose, CORS, Morgan, dotenv            |
| Database  | MongoDB Atlas                                                     |
| Hosting   | Vercel (frontend), Render (backend), MongoDB Atlas (database)     |

---

## Project structure

```
money_manager_byakshat/
├── backend/
│   ├── config/connectDb.js        # Mongoose connection
│   ├── controllers/
│   │   ├── userController.js       # register / login
│   │   └── transectionCtrl.js      # add / get / edit / delete transactions
│   ├── models/
│   │   ├── userModel.js            # name, email (unique), password
│   │   └── transectionModel.js     # userid, amount, type, category, refrence, date
│   ├── routes/
│   │   ├── userRoute.js            # /api/v1/users/*
│   │   └── transectionRoutes.js    # /api/v1/transections/*
│   ├── server.js                   # Express app entry point
│   ├── .node-version               # pins Node 22 for Render
│   └── .env                        # PORT, MONGO_URL (not committed)
└── client/
    ├── public/index.html
    └── src/
        ├── index.js                # sets axios.defaults.baseURL
        ├── App.js                  # routes + ProtectedRoutes
        ├── pages/                  # Login, Register, HomePage
        ├── components/             # Layout (Header/Footer), Analytics, Spinner
        └── styles/                 # page CSS
```

---

## API reference

Base URL: `/api/v1` — all endpoints are `POST`.

| Method | Endpoint                              | Body                                            | Purpose                |
| ------ | ------------------------------------- | ----------------------------------------------- | ---------------------- |
| POST   | `/users/register`                     | `{ name, email, password }`                     | Create an account      |
| POST   | `/users/login`                        | `{ email, password }`                           | Log in                 |
| POST   | `/transections/add-transection`       | `{ userid, amount, type, category, refrence, date, description }` | Add a transaction |
| POST   | `/transections/get-transection`       | `{ userid, frequency, selectedDate, type }`     | List transactions      |
| POST   | `/transections/edit-transection`      | `{ transacationId, payload }`                   | Edit a transaction     |
| POST   | `/transections/delete-transection`    | `{ transacationId }`                            | Delete a transaction   |

---

## Running locally

### Prerequisites

- **Node.js 22.x** and npm
- A **MongoDB** connection string (MongoDB Atlas or a local MongoDB)

The frontend and backend run as **two separate processes** (two terminals).

### 1. Backend

```bash
cd backend
npm install
# create backend/.env (see "Environment variables" below)
npm start            # runs: node server.js  ->  http://localhost:8080
```

You should see `Server running on port 8080` and `Server Running On <host>`
once it connects to MongoDB.

### 2. Frontend

```bash
cd client
npm install
# (optional) create client/.env to point at your local backend
npm start            # ->  http://localhost:3000
```

The app opens at **http://localhost:3000**. Without a `client/.env`, the
frontend talks to the deployed Render backend; create the file below to use
your **local** backend instead.

---

## Environment variables

### `backend/.env`

```env
PORT=8080
MONGO_URL=<your-mongodb-connection-string>
```

### `client/.env` (optional, local dev only — gitignored)

```env
REACT_APP_API_URL=http://localhost:8080
```

> ⚠️ Never commit real credentials. `.env` files are gitignored.

---

## Deployment

| Part      | Host          | Key settings                                                            |
| --------- | ------------- | ----------------------------------------------------------------------- |
| Frontend  | Vercel        | Root Directory: `client` · Framework: Create React App · Node 22        |
| Backend   | Render        | Start: `node server.js` · `NODE_VERSION=22` · env vars `MONGO_URL`, `PORT` |
| Database  | MongoDB Atlas | Network Access allows the backend host (e.g. `0.0.0.0/0`)               |

- Both services auto-deploy on every push to the **`main`** branch.
- The frontend reaches the backend via the absolute URL in
  `client/src/index.js` (set `REACT_APP_API_URL` in Vercel to override).
- The backend's CORS is open (`app.use(cors())`), so the Vercel frontend can
  call the Render API.
