# Local Developer Setup (Exact for this Repo)

## 1) Repo structure
- **Backend**: `backend/` (Express + Firebase Admin)
- **Frontend**: `frontend/` (React + Vite)

## 2) Required `.env` files
Create these files:
- `backend/.env`
- `frontend/.env`

You can copy from:
- `backend/.env.example`
- `frontend/.env.example`

## 3) Exact environment variables

### `backend/.env`
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 4) Install dependencies
From repo root:
```bash
npm --prefix backend install
npm --prefix frontend install
```

## 5) Start backend
```bash
npm --prefix backend run dev
```
Backend runs on **http://localhost:5000**.
Health check: **http://localhost:5000/health**.

## 6) Start frontend
In a second terminal:
```bash
npm --prefix frontend run dev
```
Frontend runs on **http://localhost:5173** (Vite default).

## 7) Firebase setup required
1. Create/select a Firebase project.
2. Enable:
   - Authentication
   - Firestore Database
   - Storage
3. Create a **service account** and use its values for backend (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`).
4. Add Firebase web app config values to `frontend/.env` (`VITE_FIREBASE_*`).

## 8) Common startup errors
- **`403 Forbidden` on `npm install`**: environment/network registry restrictions.
- **`Unauthorized` on protected APIs**: missing/invalid Firebase ID token in `Authorization: Bearer <token>`.
- **Backend auth always failing**: backend Firebase env values missing, so admin SDK is not initialized.
- **CORS errors in browser**: `CORS_ORIGIN` must match frontend URL (default `http://localhost:5173`).
- **Private key parsing issues**: keep `FIREBASE_PRIVATE_KEY` quoted with escaped `\n`.

## 9) Exact command order (copy/paste)
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# edit both .env files with real Firebase values

npm --prefix backend install
npm --prefix frontend install

npm --prefix backend run dev
# open second terminal
npm --prefix frontend run dev
```
