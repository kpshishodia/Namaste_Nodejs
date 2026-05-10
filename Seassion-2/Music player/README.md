## Music Player API (Express + MongoDB)

Backend for a music-style app: **auth** (register / login with JWT cookies) and **music** routes with role-based access. Structure follows **routes → controllers → models → middleware → services** (Namaste Node.js style).

### Tech stack

| Piece | Package |
|--------|---------|
| Runtime | Node.js (ES modules) |
| HTTP | Express **5.x** |
| Database | MongoDB via **Mongoose 9.x** |
| Passwords | bcrypt |
| Tokens | jsonwebtoken (methods on User model) |
| Uploads (ready for use) | Multer → disk (`public/temp`) |
| Media CDN (ready for use) | Cloudinary |
| Validation | validator (email on User schema) |
| Pagination plugin | mongoose-aggregate-paginate-v2 (on Music schema) |

### Folder map

| Path | Purpose |
|------|---------|
| `server.js` | Loads `.env`, connects MongoDB, starts the server on `PORT` (default **8000**). |
| `src/app.js` | Express app: CORS, JSON, cookies, static `public`, mounts **`/api/v1/auth`** and **`/api/v1/music`**. |
| `src/routes/auth.route.js` | `POST /register`, `POST /login`. |
| `src/routes/music.routes.js` | Protected music routes (e.g. create). |
| `src/controllers/Auth/register.controller.js` | Register: validate body → `User.create` → `generateAccessAndRefreshTokens()` → httpOnly cookies. |
| `src/controllers/Auth/login.controller.js` | Login: email/password → schema token methods → cookies. |
| `src/controllers/Music/music.controller.js` | Music handlers (extend for uploads / persistence). |
| `src/middlewares/verifyJWT.js` | Reads `accessToken` / `refreshToken` from cookies and verifies JWT. |
| `src/middlewares/role.js` | Ensures `role === "artist"` for artist-only routes. |
| `src/middlewares/multer.js` | Saves uploads under **`./public/temp`**. |
| `src/services/cloudinaryService.js` | Uploads local file to Cloudinary, deletes temp file. |
| `src/utils/generateTokens.js` | Shared helper to generate access/refresh tokens and persist refresh token. |
| `src/DB/Database.js` | `mongoose.connect` using `MONGO_URI` + `DB_NAME`. |
| `src/models/user.model.js` | User schema, async `pre("save")` password hash; collection **`ytuser`**. |
| `src/models/music.model.js` | Music schema + aggregate pagination plugin; collection **`ytmusic`**. |

### Environment variables

Add a **`.env`** in the project root (do not commit secrets).

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

If you rename `CLOUDNARY_CLOUD_NAME` to `CLOUDINARY_CLOUD_NAME` in `.env`, update `cloudinaryService.js` to use the same variable name.

### Run locally

```bash
npm install
node server.js
```

The server starts **after** MongoDB connects. Base URL: `http://localhost:8000` (or your `PORT`).

Ensure **`public/temp`** exists before using Multer uploads.

If startup fails with a module error for `src/app.js`, create that file (Express bootstrap) or update the import path in `server.js` to your actual app entry file.

### API overview

#### Register user

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/register` |
| **Content-Type** | `application/json` |

**Body (JSON)** — only these keys are accepted:

- `userName` — at least 4 characters after trim (stored lowercase)
- `email` — required, valid email format
- `password` — at least 6 characters
- `role` — `"user"` or `"artist"` (matches User schema enum)

**Success:** `201` with message, `user` (without password), `accessToken` in JSON, and **httpOnly** cookies: `accessToken`, `refreshToken`.
Register flow uses `src/utils/generateTokens.js` to generate/store tokens in one shared place.

#### Login

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/login` |
| **Content-Type** | `application/json` |

**Body:** `email`, `password`.

**Success:** `200` with message and `user`, plus the same cookie pair. Send requests with `credentials: "include"` from the browser if the frontend is on another origin.

#### Create music (artist only)

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/music/create-music` |
| **Auth** | Valid `accessToken` and `refreshToken` cookies; user must have **`role: "artist"`**. |

Extend the controller to accept files or JSON, upload via Cloudinary if needed, and persist with the `Music` model (`musicFile`, `thumbnail`, `title`, `duration`, `artist`, etc.).

### Troubleshooting

| Issue | What to check |
|--------|----------------|
| `Invalid fields in request` (register) | Body must only include `userName`, `email`, `password`, `role`. |
| `401` / forbidden on music routes | Log in first; cookies must be sent; user must be an **artist** for create-music. |
| Upload / Cloudinary errors | `.env` keys and Cloudinary dashboard; temp folder exists. |
| Mongo connection fails | `MONGO_URI`, Atlas IP allowlist, VPN/DNS. |
| CORS / no cookies from frontend | `CORS_ORIGIN` matches your app URL; client uses credentials on fetch/axios. |

### Author

Created by **Karan _Shishodia_**.
