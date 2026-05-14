# Music Player API (Express + MongoDB)

Backend for a music-style app: **JWT cookie auth** (register, login, logout) and **artist-only music upload** to Cloudinary with MongoDB persistence. Layout follows **routes → controllers → models → middleware → services** (Namaste Node.js style).

For a step-by-step walkthrough of only the auth wiring, see [`CODEBASE_SEQUENCE_GUIDE.md`](./CODEBASE_SEQUENCE_GUIDE.md).

## Tech stack

| Piece | Package |
|--------|---------|
| Runtime | Node.js (ES modules) |
| HTTP | Express **5.x** |
| Database | MongoDB via **Mongoose 9.x** |
| Passwords | bcrypt |
| Tokens | jsonwebtoken (methods on User model) |
| Uploads | Multer → disk (`public/temp`) |
| Media CDN | Cloudinary |
| Validation | validator (email on User schema) |
| Pagination plugin | mongoose-aggregate-paginate-v2 (on Music schema) |

## Project layout

| Path | Purpose |
|------|---------|
| `server.js` | Loads `.env`, connects MongoDB, starts the server on `PORT` (default **8000**). |
| `src/app.js` | Express app: CORS, JSON, cookies, static `public`, mounts **`/api/v1/auth`** and **`/api/v1/music`**. Root `GET /` returns a small JSON health message. |
| `src/routes/auth.route.js` | `POST /register`, `POST /login`, `POST /logout` (logout protected by JWT). |
| `src/routes/music.routes.js` | `POST /create-music` — JWT + artist role + Multer. |
| `src/controllers/Auth/*.js` | Register, login, logout handlers. |
| `src/controllers/Music/music.controller.js` | Create music: Multer file → Cloudinary → `Music.create` with placeholder thumbnail. |
| `src/middlewares/verifyJWT.js` | Reads **`accessToken`** from cookies, verifies JWT, attaches `req.user`. |
| `src/middlewares/role.js` | Ensures `role === "artist"` for artist-only routes. |
| `src/middlewares/multer.js` | Saves uploads under **`./public/temp`** (max **25 MB** per file). |
| `src/services/cloudinaryService.js` | Uploads local file to Cloudinary, deletes temp file. |
| `src/utils/generateTokens.js` | Generates access/refresh tokens and persists refresh token on the user. |
| `src/DB/Database.js` | `mongoose.connect` using `MONGO_URI` + `DB_NAME`. |
| `src/models/user.model.js` | User schema, password hash on save; collection **`ytuser`**. |
| `src/models/music.model.js` | Music schema + aggregate pagination plugin; collection **`ytmusic`**. |

## Prerequisites

- Node.js (LTS recommended)
- MongoDB (local or Atlas)
- Cloudinary account (for `POST /api/v1/music/create-music`)

## Environment variables

Create a **`.env`** in the project root (do not commit secrets).

```env
PORT=8000

MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net
DB_NAME=your_database_name

# Must match src/services/cloudinaryService.js — this repo reads CLOUDNARY_CLOUD_NAME (spelling as in code)
CLOUDNARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CORS_ORIGIN=http://localhost:3000
```

If you prefer `CLOUDINARY_CLOUD_NAME` in `.env`, rename the variable in `cloudinaryService.js` to match.

## Run locally

```bash
npm install
node server.js
```

The server starts **after** MongoDB connects. Base URL: `http://localhost:8000` (or your `PORT`).

Create **`public/temp`** before uploading files (Multer destination).

## API overview

All paths below are relative to the server origin (for example `http://localhost:8000`).

### Register

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/register` |
| **Content-Type** | `application/json` |

**Body** — only these keys are accepted:

- `userName` — at least 4 characters after trim (stored lowercase)
- `email` — required, valid email format
- `password` — at least 6 characters
- `role` — `"user"` or `"artist"` (matches User schema enum)

**Success:** `201` with message, `user` (without password), `accessToken` in JSON, and **httpOnly** cookies: `accessToken`, `refreshToken`. Tokens are created via `src/utils/generateTokens.js`.

### Login

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/login` |
| **Content-Type** | `application/json` |

**Body:** `email`, `password`.

**Success:** `200` with message and `user`, plus the same cookie pair. From a browser on another origin, send requests with `credentials: "include"` so cookies are stored and sent.

### Logout

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/logout` |
| **Auth** | Valid **`accessToken`** cookie (`verifyJWT`). |

Clears the **`refreshToken`** field on the user document server-side. Clear cookies on the client as well if you want the session fully gone in the browser.

### Create music (artist only)

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/music/create-music` |
| **Content-Type** | `multipart/form-data` |
| **Auth** | Valid **`accessToken`** cookie; user must have **`role: "artist"`**. |

**Form fields:**

- **`musicFile`** — one audio file (field name must match exactly).
- **`title`** — non-empty string.
- **`duration`** — duration in **seconds** (positive number).

Flow: file saved under `public/temp` → uploaded to Cloudinary → `Music` document created with `musicFile` URL, **`thumbnail`** set to a placeholder image URL, `artist` set to the authenticated user’s id. Response **`201`** with `message` and populated `data` (artist fields: `userName`, `email`, `role`).

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| `Invalid fields in request` (register) | Body must only include `userName`, `email`, `password`, `role`. |
| `401` on protected routes | Log in first; send **`accessToken`** cookie (protected routes use the access token, not the refresh token). |
| Forbidden on create-music | User must be an **artist**. |
| `Send one file as form-data field: musicFile` | Use multipart field name **`musicFile`**. |
| Upload / Cloudinary errors | `.env` Cloudinary keys; `public/temp` exists; file under 25 MB. |
| Mongo connection fails | `MONGO_URI`, Atlas IP allowlist, VPN/DNS. |
| CORS / no cookies from frontend | `CORS_ORIGIN` matches your app URL; client uses credentials on fetch/axios. |

## Author

Created by **Karan _Shishodia_**.
