# Music Player API (Express + MongoDB)

Backend for a music-style app: **JWT cookie auth** (register, login, logout, refresh access token) and **artist-only music upload** to Cloudinary with MongoDB persistence. Structure follows **routes → controllers → models → middleware → services** (Namaste Node.js style).

For a step-by-step walkthrough of auth wiring, see [`CODEBASE_SEQUENCE_GUIDE.md`](./CODEBASE_SEQUENCE_GUIDE.md).

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
| `src/app.js` | Express app: CORS, JSON, cookies, static `public`, mounts **`/api/v1/auth`** and **`/api/v1/music`**. `GET /` health check. |
| `src/routes/auth.route.js` | Auth routes: register, login, logout, refresh-token. |
| `src/routes/music.routes.js` | `POST /create-music` — JWT + artist role + Multer. |
| `src/controllers/Auth/register.controller.js` | Register user, issue tokens, set cookies. |
| `src/controllers/Auth/login.controller.js` | Login, issue tokens, set cookies. |
| `src/controllers/Auth/logout.controller.js` | Clear refresh token in DB, clear auth cookies. |
| `src/controllers/Auth/refreshAccessToken.js` | Issue new access/refresh tokens using valid refresh token. |
| `src/controllers/Music/music.controller.js` | Upload audio → Cloudinary → save `Music` document. |
| `src/middlewares/verifyJWT.js` | Reads **`accessToken`** cookie, verifies JWT, sets `req.user`. |
| `src/middlewares/role.js` | Allows only **`role: "artist"`** on music upload. |
| `src/middlewares/multer.js` | Disk storage under **`./public/temp`** (max **25 MB**). |
| `src/services/cloudinaryService.js` | Upload local file to Cloudinary, delete temp file. |
| `src/utils/generateTokens.js` | Shared helper: generate tokens + save refresh token in DB. |
| `src/DB/Database.js` | `mongoose.connect` using `MONGO_URI` + `DB_NAME`. |
| `src/models/user.model.js` | User schema; collection **`ytuser`**. |
| `src/models/music.model.js` | Music schema; collection **`ytmusic`**. |

## Prerequisites

- Node.js (LTS recommended)
- MongoDB (local or Atlas)
- Cloudinary account (for music upload)

## Environment variables

Create a **`.env`** in the project root (do not commit secrets).

```env
PORT=8000

MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net
DB_NAME=your_database_name

# Must match src/services/cloudinaryService.js (spelling as in code)
CLOUDNARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CORS_ORIGIN=http://localhost:3000
```

If you prefer `CLOUDINARY_CLOUD_NAME` in `.env`, update `cloudinaryService.js` to use the same name.

## Run locally

```bash
npm install
node server.js
```

The server starts **after** MongoDB connects. Base URL: `http://localhost:8000` (or your `PORT`).

Create **`public/temp`** before uploading files (Multer writes there first).

## API overview

All paths are relative to the server origin (e.g. `http://localhost:8000`).

Use **`credentials: "include"`** in the browser (or equivalent in your HTTP client) so cookies are sent on protected routes.

### Register

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/register` |
| **Content-Type** | `application/json` |

**Body** — only these keys are accepted:

| Field | Rules |
|-------|--------|
| `userName` | At least 4 characters after trim (stored lowercase) |
| `email` | Required; validated on the User schema |
| `password` | At least 6 characters |
| `role` | `"user"` or `"artist"` |

**Success (`201`):** message, `user` (password excluded), `accessToken` and `refreshToken` in JSON, plus **httpOnly** cookies: `accessToken`, `refreshToken`.

### Login

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/login` |
| **Content-Type** | `application/json` |

**Body:** `email`, `password`.

**Success (`200`):** message, `user`, and the same cookie pair as register.

### Logout

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/logout` |
| **Auth** | Valid **`accessToken`** cookie (`verifyJWT`) |

**Success (`200`):** clears `refreshToken` in the database, clears **`accessToken`** and **`refreshToken`** cookies, returns a success message.

### Refresh access token

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/refresh-token` |
| **Auth** | Route uses `verifyJWT` in `auth.route.js` (see your route file for exact middleware order) |

**Refresh token source:** `refreshToken` cookie, or `refreshToken` in the request body.

**Success (`200`):** new `accessToken` and `refreshToken` in cookies and JSON; refresh token in DB is rotated via `generateTokens.js`.

### Create music (artist only)

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/music/create-music` |
| **Content-Type** | `multipart/form-data` |
| **Auth** | Valid **`accessToken`** cookie; **`role: "artist"`** |

**Middleware order:** `verifyJWT` → `verifyArtist` → Multer (`musicFile`) → controller.

**Form fields:**

| Field | Description |
|-------|-------------|
| `musicFile` | One audio file (field name must match exactly) |
| `title` | Non-empty string |
| `duration` | Positive number (seconds) |

**Success (`201`):** `message` and populated `data` (`artist`: `userName`, `email`, `role`). Audio URL from Cloudinary; `thumbnail` uses a placeholder until you add a separate upload.

## Request flow (high level)

```text
Client → server.js (DB connect) → app.js → route → middleware → controller → model / service
```

**Auth:** register/login → `generateTokens.js` → cookies. Protected routes → `verifyJWT` → `req.user`.

**Music upload:** JWT + artist check → Multer (`public/temp`) → Cloudinary → `Music.create`.

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| `Invalid fields in request` (register) | Body must only include `userName`, `email`, `password`, `role`. |
| `401` on protected routes | Log in first; send **`accessToken`** cookie. |
| `Refresh token is missing` / mismatch | Login again; cookie or body must match DB `refreshToken`. |
| Forbidden on create-music | User must be an **artist**. |
| `Send one file as form-data field: musicFile` | Multipart field name must be **`musicFile`**. |
| Upload / Cloudinary errors | `.env` keys; `public/temp` exists; file under 25 MB. |
| Mongo connection fails | `MONGO_URI`, `DB_NAME`, Atlas IP allowlist. |
| CORS / cookies not sent | `CORS_ORIGIN` matches frontend URL; `credentials: true` on client. |

## Author

Created by **Karan _Shishodia_**.
