# SyncSchedule

A social academic planning application built with the MEAN stack (MongoDB, Express, Angular, Node.js).

SyncSchedule allows university students to input their weekly course schedules, build a friends network, and instantly compare schedules to identify shared classes and mutual free time.

---

## Project Structure

```
syncschedule/
  server/               Express + Node.js MVC backend
    app.js              Express app with middleware and route wiring
    server.js           HTTP server entry point
    router.js           Top-level API router
    seed.js             Database seed script
    models/             Mongoose schemas (User, Schedule)
    routes/             Route definitions
    controllers/        Business logic handlers
    .env.example        Environment variable template
  client/               Angular 17 frontend
    src/app/
      components/       auth, schedule-dashboard, friend-list, compare
      services/         AuthService, ScheduleService, FriendService, CompareService
      interfaces/       Shared TypeScript interfaces
      guards/           AuthGuard for protected routes
    proxy.conf.json     Dev proxy to forward /api to Express
```

---

## Prerequisites

- Node.js v18 or later
- MongoDB running locally on port 27017, or a MongoDB Atlas URI
- Angular CLI: `npm install -g @angular/cli`

---

## Setup

### 1. Clone and install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure environment variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and set your values:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/syncschedule
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 3. Seed the database

```bash
cd server
npm run seed
```

This creates three test users with schedules and friendships pre-established:

| Email                        | Password    |
|------------------------------|-------------|
| caleb@syncschedule.com       | password123 |
| henry@syncschedule.com       | password123 |
| alice@syncschedule.com       | password123 |

---

## Running the Application

Open two terminals.

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs at `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd client
ng serve
```
App runs at `http://localhost:4200`

The Angular dev server proxies all `/api` requests to the Express backend automatically via `proxy.conf.json`.

---

## API Endpoints

### Users
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| POST   | /api/users/register       | Register a new user      |
| POST   | /api/users/login          | Log in                   |
| GET    | /api/users/search?username= | Search users by name   |
| GET    | /api/users/:id            | Get user profile         |
| PUT    | /api/users/:id            | Update user profile      |
| DELETE | /api/users/:id            | Delete user              |

### Schedules
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/schedules/:userId    | Get all courses for user |
| GET    | /api/schedules/entry/:id  | Get a single course      |
| POST   | /api/schedules            | Add a new course         |
| PUT    | /api/schedules/:id        | Update a course          |
| DELETE | /api/schedules/:id        | Delete a course          |

### Friends
| Method | Endpoint                              | Description          |
|--------|---------------------------------------|----------------------|
| GET    | /api/friends/:userId                  | List friends         |
| POST   | /api/friends/:userId/add/:friendId    | Add a friend         |
| DELETE | /api/friends/:userId/remove/:friendId | Remove a friend      |

### Compare
| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | /api/compare/:userId/:friendId    | Compare two users' schedules   |

---

## Mongoose Models

### User
- `username` String, required, unique
- `email` String, required, unique
- `password` String, required, hashed with bcrypt
- `friends` Array of ObjectId references to User

### Schedule
- `userId` ObjectId, ref User, required
- `courseName` String, required
- `courseCode` String
- `days` Array of day strings (Monday - Sunday)
- `startTime` String (HH:MM)
- `endTime` String (HH:MM)
- `location` String
- `color` String (hex color)

---

## Angular Components

| Component               | Route              | Description                                  |
|-------------------------|--------------------|----------------------------------------------|
| AuthComponent           | /auth              | Login and registration with reactive forms   |
| ScheduleDashboardComponent | /dashboard      | Weekly grid with full CRUD for courses       |
| FriendListComponent     | /friends           | Search users, add/remove friends             |
| CompareComponent        | /compare/:friendId | Side-by-side schedule comparison view        |

---

## Team

- Caleb - Frontend (Angular components, services, UI)
- Henry - Backend (Express routes, controllers, Mongoose models, seed)
