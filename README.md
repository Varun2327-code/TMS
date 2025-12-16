# Collaborative Task Manager

A full-stack implementation of a real-time collaborative task management system.

## Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, SWR
- **Backend:** Node.js, Express, TypeScript, Mongoose (MongoDB), Socket.io
- **Auth:** JWT, bcrypt
- **Real-time:** Socket.io

## Features

- **User Authentication:** Register, Login, JWT-based session.
- **Task Management:** Create, Read (filter/sort), Update, Delete tasks.
- **Real-time Collaboration:** Instant updates on task creation, modification, and deletion. Notifications for assignment.
- **Responsive Dashboard:** Modern clean UI with dark mode.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Atlas connection string)

### Backend

1. Navigate to `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Environment Variables:
   Create a `.env` file in `backend` with:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/tms
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ```
4. Run the server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Architecture & Design

- **Service-Repository Pattern:** The backend decouples business logic (Services) from data access (Repositories) and HTTP handling (Controllers).
- **Socket.io Integration:** The `TaskService` emits events directly after successful DB operations, ensuring the UI state is always consistent with the backend state.
- **Data Fetching:** SWR is used on the frontend for stale-while-revalidate caching, providing a snappy user experience.

## Tests

Run backend tests:
```bash
cd backend
npm test
```
