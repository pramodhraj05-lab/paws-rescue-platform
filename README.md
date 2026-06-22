# 🐾 Paws Rescue Platform

A full-stack animal rescue and adoption management system built with the MERN stack (MongoDB, Express, React, Node.js). Developed as part of the B9IS130 Web Development for Information Systems module at Dublin Business School.

---

## 🚀 Live Demo

| Service | URL |
|--------|-----|
| Frontend | https://paws-rescue-platform.vercel.app |
| Backend API | https://paws-rescue-platform.onrender.com |

**Demo Login:** `admin@paws.ie` / `admin123`

---

## 📋 Features

- 🔐 JWT-based authentication and role-based authorisation (admin / user)
- 🐶 Animal listings with breed suggestions via [dog.ceo API](https://dog.ceo/dog-api/) and [TheCatAPI](https://thecatapi.com/)
- 🏠 Shelter management with CRUD operations
- ❤️ Adoption request workflow (submit → approve / reject)
- 🗺️ Interactive shelter map powered by Leaflet + OpenStreetMap
- 🧪 12 automated Jest tests with GitHub Actions CI/CD
- ☁️ Deployed on Vercel (frontend) + Render (backend) + MongoDB Atlas (database)

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Leaflet (interactive maps)
- Axios

**Backend**
- Node.js + Express 5
- Mongoose 8 (pinned — v9 breaks CI on Linux runners)
- JWT for authentication
- bcryptjs for password hashing
- express-rate-limit for API protection

**Database**
- MongoDB Atlas (cloud-hosted)

**DevOps**
- GitHub Actions CI (Node 22, MongoDB 6 service container)
- Vercel (frontend hosting)
- Render (backend hosting)

**External APIs**
- [dog.ceo](https://dog.ceo/dog-api/) — dog breed suggestions
- [TheCatAPI](https://thecatapi.com/) — cat breed suggestions
- OpenStreetMap via Leaflet — shelter map

---

## 📁 Project Structure

```
paws-rescue-platform/
├── client/                   # React + Vite frontend
│   └── src/
│       ├── api.js            # Axios instance with base URL
│       ├── AuthContext.jsx   # Global auth state
│       ├── App.jsx           # Routes
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Track.jsx
│       │   └── Dashboard.jsx
│       └── components/
│           ├── AnimalsView.jsx
│           ├── SheltersView.jsx
│           ├── AdoptionsView.jsx
│           ├── UsersView.jsx
│           ├── BreedSuggest.jsx
│           └── SheltersMap.jsx
│
└── server/                   # Node.js + Express backend
    ├── app.js                # Express app (exported for tests)
    ├── server.js             # Entry point
    ├── db/
    │   ├── connection.js     # MongoDB connection
    │   ├── seed.js           # Seed: 1 admin, 4 shelters, 9 animals
    │   └── models/
    │       ├── User.js
    │       ├── Animal.js
    │       ├── Shelter.js
    │       └── Adoption.js
    ├── routes/
    │   ├── auth.js
    │   ├── animals.js
    │   ├── shelters.js
    │   └── adoptions.js
    ├── middleware/
    │   └── auth.js           # JWT verification middleware
    └── tests/
        ├── health.test.js
        ├── auth.test.js
        └── animals.test.js
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/pramodhraj05-lab/paws-rescue-platform.git
cd paws-rescue-platform
```

### 2. Backend setup
```bash
cd server
npm install --ignore-scripts
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```

### Environment Variables

Create `server/.env`:
```env
PORT=5001
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 4. Seed the database
```bash
cd server
node db/seed.js
```
This creates: 1 admin user, 4 Irish animal shelters, 9 animals.

---

## 🧪 Running Tests

```bash
cd server
npm test
```

- 12 Jest tests covering health check, auth endpoints, and animal CRUD
- Uses `mongodb-memory-server` for isolated in-memory DB (CI only)
- GitHub Actions runs tests on every push to `main`

---

## 🔒 Security

- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens with expiry for session management
- express-rate-limit on auth routes (brute-force protection)
- Input validation on all API routes
- MongoDB Atlas IP whitelist + TLS encryption in transit
- CORS configured to allow only the frontend origin in production

---

## 🌱 Database Seeding

```bash
node server/db/seed.js
```

Seeds the following:
- **Admin:** `admin@paws.ie` / `admin123`
- **Shelters:** 4 Irish shelters (Dublin, Cork, Galway, Limerick)
- **Animals:** 9 animals across species (dogs, cats, rabbits)

---

## 📦 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/test.yml`):
- Triggers on push to `main`
- Node 22 runner
- MongoDB 6 service container
- Runs all 12 Jest tests
- Blocks merge on test failure

---

## 👤 Author

**Pramodh Selvaraj**  
MSc Information Systems with Computing  
Dublin Business School  
Module: B9IS130 Web Development for Information Systems
