# Music Player API (Express + MongoDB)

Backend for a music-style app with **JWT cookie auth**, **user profile management**, and **artist-only music upload** to Cloudinary. Structure follows **routes → controllers → models → middleware → services** (Namaste Node.js style).

For auth execution order, see [`CODEBASE_SEQUENCE_GUIDE.md`](./CODEBASE_SEQUENCE_GUIDE.md).

## Tech stack

| Piece | Package |
|--------|---------|
| Runtime | Node.js (ES modules) |
| HTTP | Express **5.x** |
| Database | MongoDB via **Mongoose 9.x** |
| Passwords | bcrypt |
| Tokens | jsonwebtoken (methods on User model) |
| Uploads | Multer → disk (`public/temp`) |
| Media CDN | Cloudinary (`uploadOnCloudinary`, `deleteFromCloudinary`) |
| Validation | validator (email, strong password) |
| Pagination plugin | mongoose-aggregate-paginate-v2 (on Music schema) |

## Project layout

| Path | Purpose |
|------|---------|
| `server.js` | Loads `.env`, connects MongoDB, starts server on `PORT` (default **8000**). |
| `src/app.js` | Express app: CORS, JSON, cookies, static `public`, mounts **`/api/v1/auth`** and **`/api/v1/music`**. |
| `src/routes/auth.route.js` | Auth + profile routes (active v2 controllers). |
| `src/routes/music.routes.js` | `POST /create-music` — JWT + artist + Multer. |
| `src/controllers/Auth/register2.controller.js` | Register with avatar/cover upload → Cloudinary → tokens + cookies. |
| `src/controllers/Auth/login2.controller.js` | Login with validation → tokens + cookies. |
| `src/controllers/Auth/logout2.controller.js` | Logout: clear refresh token in DB + clear cookies. |
| `src/controllers/Auth/refreshAccess2Token.js` | Public refresh route: new access/refresh tokens from cookie. |
| `src/controllers/Auth/getProfile.controller.js` | Return logged-in user profile (`req.user`). |
| `src/controllers/Profile/updatePassword2.controller.js` | Change password (current + new + confirm). |
| `src/controllers/Profile/updateProfile2.controller.js` | Update profile text fields (and optional images when Multer is wired). |
| `src/controllers/Music/music.controller.js` | Upload audio → Cloudinary → save `Music` document. |
| `src/middlewares/verify2JWT.js` | Auth middleware used on protected auth/profile routes. |
| `src/middlewares/verifyJWT.js` | Auth middleware used on music routes. |
| `src/middlewares/role.js` | Artist-only check for music upload. |
| `src/middlewares/multer.js` | Disk storage under `./public/temp` (max **25 MB**). |
| `src/utils/RegisterValidation.js` | Sign-up field validation (username, email, strong password, gender, age). |
| `src/utils/LoginValidation.js` | Login email/password validation. |
| `src/utils/generateTokens.js` | Shared token helper (used by older v1 auth controllers). |
| `src/services/cloudinaryService.js` | Upload/delete files on Cloudinary. |
| `src/DB/Database.js` | `mongoose.connect` using `MONGO_URI` + `DB_NAME`. |
| `src/models/user.model.js` | User schema; collection **`ytuser`**. |
| `src/models/music.model.js` | Music schema; collection **`ytmusic`**. |
| `src/models/subscription.model.js` | Subscription schema (model scaffold; not mounted on routes yet). |

> **Note:** Older v1 auth files (`register.controller.js`, `login.controller.js`, etc.) remain in the repo but are **not** wired in `auth.route.js`. Active routes use the `*2` controllers and `verify2JWT`.

## Prerequisites

- Node.js (LTS recommended)
- MongoDB (local or Atlas)
- Cloudinary account (register + music upload)

## Environment variables

Create a **`.env`** in the project root (do not commit secrets).

```env
PORT=8000
NODE_ENV=development

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

Cookies use `secure: true` when `NODE_ENV=production`.

## Run locally

```bash
npm install
node server.js
```

Server starts **after** MongoDB connects. Base URL: `http://localhost:8000` (or your `PORT`).

Create **`public/temp`** before any file upload (Multer destination).

Use **`credentials: "include"`** in the browser so auth cookies are sent on protected routes.

---

## API overview

Base path: **`/api/v1/auth`**

### Register

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/register` |
| **Content-Type** | `multipart/form-data` |
| **Middleware** | Multer fields: `avatar` (1), `coverImage` (up to 2) |

**Text fields:**

| Field | Rules |
|-------|--------|
| `userName` | 4–20 characters |
| `email` | Valid email |
| `password` | Strong password (upper, lower, number, special char via `validator.isStrongPassword`) |
| `gender` | `"male"`, `"female"`, or `"others"` |
| `age` | Number, minimum **18** |

**Files (required):**

| Field | Description |
|-------|-------------|
| `avatar` | Profile image |
| `coverImage` | Cover image |

**Success (`200`):** `message`, `createdUser` (password/refreshToken excluded), **httpOnly** cookies `accessToken` (1 day) and `refreshToken` (7 days).

---

### Login

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/login` |
| **Content-Type** | `application/json` |

**Body:** `email`, `password` (validated by `LoginValidation.js`).

**Success (`200`):** `message`, `createdUser`, plus `accessToken` and `refreshToken` cookies.

---

### Refresh access token

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/refresh-token` |
| **Auth** | **Public** — no `verifyJWT` |

**Refresh token source:** `refreshToken` **cookie only**.

**Success (`200`):** new tokens in cookies + success message. Refresh token in DB is rotated.

---

### Logout

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/logout` |
| **Auth** | `verify2JWT` |

**Success (`200`):** clears `accessToken` and `refreshToken` cookies, updates user in DB.

---

### Get profile

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/v1/auth/profile` |
| **Auth** | `verify2JWT` |

**Success (`200`):** `message`, `user` (from `req.user`).

---

### Update password

| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/v1/auth/updatePassword` |
| **Auth** | `verify2JWT` |
| **Content-Type** | `application/json` |

**Body:**

| Field | Rules |
|-------|--------|
| `currentPassword` | Required |
| `newPassword` | Required, min **8** characters, must differ from current |
| `confirmPassword` | Must match `newPassword` |

**Success (`200`):** password updated (hashed via User `pre("save")` hook).

---

### Update profile

| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/v1/auth/updateProfile` |
| **Auth** | `verify2JWT` |
| **Content-Type** | `application/json` (text fields on current route) |

**Allowed text fields (send only fields you want to change):**

| Field | Rules |
|-------|--------|
| `userName` | String, 3–30 characters |
| `age` | Integer, 13–120 |
| `about` | String, max 500 characters |
| `skills` | Array of non-empty strings |

The controller also supports optional `avatar` / `coverImage` file uploads (JPEG, PNG, WebP, max 5 MB each) when Multer is added to this route.

**Success (`200`):** `message`, updated `user`.

---

## Music API

Base path: **`/api/v1/music`**

### Create music (artist only)

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/music/create-music` |
| **Content-Type** | `multipart/form-data` |
| **Auth** | `verifyJWT` + **`role: "artist"`** |

**Middleware order:** `verifyJWT` → `verifyArtist` → Multer (`musicFile`) → controller.

**Form fields:**

| Field | Description |
|-------|-------------|
| `musicFile` | One audio file |
| `title` | Non-empty string |
| `duration` | Positive number (seconds) |

**Success (`201`):** `message`, populated `data` with artist info. `thumbnail` uses a placeholder URL until a separate upload is added.

---

## Request flow

```text
Client → server.js (DB connect) → app.js → route → middleware → controller → model / service
```

**Register:** Multer → validation → Cloudinary (avatar + cover) → `User.create` → tokens → cookies.

**Login / refresh:** credentials or refresh cookie → tokens → cookies.

**Protected auth/profile:** `verify2JWT` → `req.user` → controller.

**Music upload:** `verifyJWT` → artist check → Multer → Cloudinary → `Music.create`.

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| `Invalid fields in request object` (register) | Body keys must be exactly `userName`, `email`, `password`, `gender`, `age`. |
| Strong password error | Password needs upper, lower, number, and special character. |
| `Error getting files from client through multer` | Send both `avatar` and `coverImage` as multipart fields. |
| `401` / `Unauthorized access` | Log in first; send **`accessToken`** cookie. |
| Refresh token errors | `refreshToken` cookie must match value stored in DB. |
| Forbidden on create-music | User must have **`role: "artist"`**. |
| Upload / Cloudinary errors | `.env` keys; `public/temp` exists; file size limits. |
| Mongo connection fails | `MONGO_URI`, `DB_NAME`, Atlas IP allowlist. |
| CORS / cookies not sent | `CORS_ORIGIN` matches frontend; client uses `credentials: "include"`. |

---

## Author

Created by **Karan _Shishodia_**.
