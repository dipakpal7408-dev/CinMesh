# CinMesh

Live chat + posts + community platform for B.Tech students, built as a MERN
stack app with realtime features powered by Socket.IO.

```
cinmesh/
├── client/   React + Vite frontend (Tailwind CSS v4)
└── server/   Node.js + Express + MongoDB + Socket.IO backend
```

## Features

- **Auth** — register/login with JWT, bcrypt-hashed passwords
- **Student profiles** — college, branch, year, skills, bio, GitHub/LinkedIn, avatar
- **Posts** — text + image/video, likes, comments, save, report, per-community feeds
- **Live chat** — 1-to-1 and group chats, typing indicators, seen/delivered receipts,
  online presence, image/file attachments — all realtime via Socket.IO
- **B.Tech communities** — organized by branch (CSE, ECE, EE, ME, CE, IT) and
  category (DSA, Web Dev, AI/ML, GATE, Placements, Internships, Projects…)
- **Notifications** — likes, comments, follows, pushed live to online users

## Prerequisites

- Node.js 18+
- A MongoDB instance (local, or a free MongoDB Atlas cluster)
- (Optional) A Cloudinary account for image/file uploads — without it,
  posting text-only content still works fine, but media uploads will fail

## 1. Backend setup

```bash
cd server
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, and (optionally) Cloudinary keys
npm install
npm run seed   # creates the default B.Tech communities (optional but recommended)
npm run dev    # starts the API + Socket.IO server on http://localhost:5000
```

## 2. Frontend setup

Open a second terminal:

```bash
cd client
cp .env.example .env
# edit .env if your API isn't on http://localhost:5000
npm install
npm run dev    # starts the Vite dev server on http://localhost:5173
```

Visit `http://localhost:5173`, create an account, and you're in.

## 3. Production build

```bash
cd client
npm run build     # outputs static files to client/dist

cd ../server
npm start          # runs the API with NODE_ENV=production
```

Deploy `client/dist` to any static host (Vercel, Netlify, S3 + CloudFront) and
`server/` to any Node host (Render, Railway, Fly.io, a VPS). Point the client's
`VITE_API_URL` at wherever the backend ends up living, and set `CLIENT_URL` in
the backend `.env` to the deployed frontend's origin (for CORS + Socket.IO).

## Architecture notes

- The backend follows a layered structure: `models` → `controllers` → `routes`,
  with `middleware` for auth/errors/uploads and `services` for reusable logic
  (Cloudinary uploads, notification creation) shared between REST controllers
  and the Socket.IO layer.
- The frontend uses a conventional `components/pages/services/hooks/context`
  split. As the app grows, tightly-coupled groups (e.g. everything chat-related)
  can move into `features/chat/` without disturbing the rest — the `features/`
  folders are already scaffolded for this.
- Realtime chat is dual-pathed on purpose: `POST /api/messages` exists for
  reliability (works even if a socket briefly drops), while
  `socket.emit("message:send", …)` is what the UI actually uses for the
  instant, no-refresh experience. Both write to the same `Message` collection.

## Known limitations (intentionally left for you to extend)

- Email verification and "forgot password" are stubbed out in the User model
  (`isEmailVerified` field exists) but no email-sending flow is wired up yet.
- File/image uploads require Cloudinary credentials; there's no local-disk
  fallback.
- No automated tests yet — routes are organized to make adding
  `supertest` / `jest` coverage straightforward.
