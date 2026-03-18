## Express Router + JWT Auth Project

This project is a small Express + MongoDB API that demonstrates:

- User registration and login with **JWT**
- Cookie-based authentication using **`cookie-parser`**
- Protected routes for **profile** and **connection requests**

It uses **Mongoose** for MongoDB and **bcrypt + jsonwebtoken + cookie-parser** for authentication.

---

## Project Structure

- `src/app.js` – Main Express app:
  - Loads environment variables via `dotenv`
  - Connects to MongoDB
  - Registers global middlewares (`express.json`, `cookie-parser`)
  - Mounts route modules

- `src/config/Database.js` – MongoDB connection helper using `MONGO_URL` from `.env`.

- `src/models/user.js` – Mongoose `User` model with fields:
  - `firstName`, `lastName`, `gender`, `email`, `password`, `age`, `about`, `skills`
  - Email validation using `validator`
  - Timestamps for `createdAt` and `updatedAt`

- `src/middleware/Auth.js` – Authentication middleware:
  - Reads JWT from `req.cookies.token`
  - Verifies it with `process.env.JWT_SECRET`
  - Loads the corresponding user from MongoDB
  - Attaches the user document to `req.user`

- `src/routes/auth.js` – Auth routes:
  - `POST /signup` – Register user
  - `POST /login` – Login user, create JWT, store it in HTTP-only cookie

- `src/routes/profile.js` – Profile routes:
  - `GET /profile` – Protected profile endpoint using `UserAuth` middleware

- `src/routes/connectionRequest.js` – Connection request routes:
  - `POST /SendConnectionRequest` – Protected; uses `UserAuth` and responds with a simple message using `req.user.firstName`

---

## Environment Variables

Create a `.env` file (same folder as `src` config expects) with:

```env
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>/<db_name>
JWT_SECRET=your_strong_secret_here
```

- **`MONGO_URL`** – Full MongoDB connection URI used by `src/config/Database.js`.
- **`JWT_SECRET`** – Secret key used for:
  - Creating JWT in `auth.js` using `jwt.sign(...)`
  - Verifying JWT in `Auth.js` using `jwt.verify(...)`

This secret is **never sent to the client**; only the signed token is sent and stored in a cookie.

---

## How Authentication Works

1. **Signup (`POST /signup`)**
   - Accepts user data in JSON body.
   - Hashes the password with `bcrypt` before saving to MongoDB.
   - Returns `201` on success.

2. **Login (`POST /login`)**
   - Accepts `email` and `password`.
   - Finds the user by email.
   - Compares the plain password with the stored hash using `bcrypt.compare`.
   - On success:
     - Creates a JWT with payload `{ _id: user._id }` and secret `process.env.JWT_SECRET`.
     - Stores the token in an HTTP-only cookie named `token`.

3. **Protected Routes**
   - `GET /profile`
   - `POST /SendConnectionRequest`
   - Both use the `UserAuth` middleware:
     - Reads the `token` from `req.cookies.token` (requires `cookie-parser` registered in `app.js`).
     - Verifies it with `process.env.JWT_SECRET`.
     - Loads the user and attaches it to `req.user`.

Global middlewares (`express.json` and `cookie-parser`) are registered once in `app.js` so that **all** routes can access `req.body` and `req.cookies`.

---

## Running the Project

1. Install dependencies:

```bash
npm install
```

2. Create `.env` as described above.

3. Start the app from the repository root:

```bash
node "Seassion-2/Episode-10(Express Router)/src/app.js"
```

4. Example requests (default port **7000**):
   - `POST http://localhost:7000/signup`
   - `POST http://localhost:7000/login`
   - `GET http://localhost:7000/profile`
   - `POST http://localhost:7000/SendConnectionRequest`

When calling protected routes from a browser or frontend app, ensure cookies are sent with the request (e.g. `credentials: "include"` in `fetch` or `withCredentials: true` in Axios).

