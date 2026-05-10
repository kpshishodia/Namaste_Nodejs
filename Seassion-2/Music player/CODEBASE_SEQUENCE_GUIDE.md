# Auth Sequence Guide (Connection Logic)

This file explains only the authentication-related code and how auth files connect in execution order.

## 1) Startup and app wiring

### `server.js`
- Project entry point.
- Loads `.env`.
- Imports DB connector (`src/DB/Database.js`).
- Imports Express app (`src/app.js`).
- Connects MongoDB first, then starts HTTP server.

### `src/DB/Database.js`
- Reads `MONGO_URI` and `DB_NAME`.
- Builds DB URL and connects with `mongoose.connect(...)`.
- Throws on failure so server does not start in broken state.

### `src/app.js` (auth view)
- Creates Express app.
- Applies global middleware needed by auth:
  - JSON/urlencoded parsers.
  - `cookieParser()` so auth middleware can read cookie tokens.
  - CORS with `credentials: true` for browser cookie-based auth.
- Mounts auth router:
  - `/api/v1/auth` -> `src/routes/auth.route.js`

## 2) Auth route layer

### `src/routes/auth.route.js`
- Defines public auth routes:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
- For now these routes directly call controllers (no `verifyJWT` on them).

## 3) Auth controller layer

### `src/controllers/Auth/register.controller.js`
- Reads and validates `userName`, `email`, `password`, `role`.
- Rejects unexpected request fields.
- Checks if user already exists by email.
- Creates user using `User.create(...)`.
- Calls shared token helper to create/store tokens.
- Sets `accessToken` and `refreshToken` cookies.
- Returns success response with created user.

### `src/controllers/Auth/login.controller.js`
- Reads `email` and `password`.
- Finds user by normalized email.
- Verifies password via model method.
- Calls shared token helper to create/store tokens.
- Sets `accessToken` and `refreshToken` cookies.
- Returns login response.

## 4) Auth middleware layer

### `src/middlewares/verifyJWT.js`
- Used for protected endpoints (like future `logout`, `me`, etc.).
- Reads `accessToken` from cookies.
- Verifies token signature + expiry.
- Attaches decoded payload to `req.user`.
- Rejects request if token is missing/invalid.

## 5) Auth model layer

### `src/models/user.model.js`
- Defines user schema and validations.
- Hashes password in `pre("save")`.
- Provides auth methods:
  - `isPasswordCorrect(password)`
  - `generateAccessToken()`
  - `generateRefreshToken()`
- Stores refresh token in DB (`refreshToken` field).

## 6) Auth utility layer

### `src/utils/generateTokens.js`
- Shared token utility used by auth controllers.
- Finds user by ID.
- Generates access + refresh token using user model methods.
- Saves latest refresh token in user document.
- Returns `{ accessToken, refreshToken }`.

---

## End-to-end auth stories

### A) Register flow
1. Client calls `POST /api/v1/auth/register`.
2. `auth.route.js` forwards to register controller.
3. Controller validates input and creates user through `User` model.
4. Controller calls `generateTokens.js`.
5. Utility generates tokens and stores refresh token in DB.
6. Controller sets cookies and returns response.

### B) Login flow
1. Client calls `POST /api/v1/auth/login`.
2. `auth.route.js` forwards to login controller.
3. Controller finds user and verifies password method.
4. Controller calls `generateTokens.js`.
5. Utility generates/stores tokens.
6. Controller sets cookies and returns response.

## Short auth mental map

- `server.js` boots app after DB connect.
- `app.js` mounts auth router and common middleware.
- `auth.route.js` maps endpoint to controller.
- Controllers run business logic.
- `User` model handles password hashing + JWT methods.
- `generateTokens.js` keeps token logic reusable.
- `verifyJWT` protects private auth endpoints.
