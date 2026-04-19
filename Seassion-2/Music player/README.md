## Professional Backend Setup – Routes & Controllers

Express + MongoDB API with a clear split between **routes**, **controllers**, **models**, **middleware** (Multer), and **services** (Cloudinary).

### Tech stack

| Piece | Package |
|--------|---------|
| Runtime | Node.js |
| HTTP | Express **5.x** |
| Database | MongoDB via **Mongoose 9.x** |
| Passwords | bcrypt |
| Tokens | jsonwebtoken (helpers on User model) |
| Uploads | Multer → disk (`public/temp`) |
| Media CDN | Cloudinary |
| Validation | validator (e.g. email on User schema) |

### Folder map

| Path | Purpose |
|------|---------|
| `server.js` | Loads `.env`, connects MongoDB, starts the server on `PORT` (default **8000**). |
| `src/app.js` | Express app: CORS, JSON, cookies, static `public`, mounts **`/api/v1/users`**. |
| `src/routes/user.route.js` | User routes; **`POST /register`** uses Multer `fields` for files. |
| `src/controllers/user.controller.js` | Register handler: validate body → files → Cloudinary → `User.create`. |
| `src/middlewares/multer.js` | Saves uploads under **`./public/temp`** (create this folder if missing). |
| `src/services/cloudinaryService.js` | Uploads local file to Cloudinary, deletes temp file, returns result (`.url`). |
| `src/DB/Database.js` | `mongoose.connect` using `MONGO_URI` + `DB_NAME`. |
| `src/models/user.model.js` | User schema, **async** `pre("save")` password hash (no `next`). |
| `src/models/video.model.js` | Video schema + aggregate pagination plugin. |
| `src/constants.js` | Shared constants (extend as needed). |

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

The process listens **after** MongoDB connects. Base URL: `http://localhost:8000` (or your `PORT`).

### API: register user

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/v1/users/register` |
| **Full URL** | `http://localhost:<PORT>/api/v1/users/register` |
| **Content-Type** | `multipart/form-data` (not raw JSON) |

**Text fields (form-data)**

- `firstName` — at least 4 characters after trim  
- `lastName`  
- `email`  
- `password`  

**File fields — names must match exactly (case-sensitive)**

- `avatar` — one file  
- `coverImage` — at least one file (route allows up to 3)  

**Success:** `201` with a message and `createdUser` (password and refresh token omitted).

### Troubleshooting

| Issue | What to check |
|--------|----------------|
| `MulterError: Unexpected field` | File keys are not exactly `avatar` and `coverImage`. |
| `Invalid fields in request` | Extra text keys in `req.body`; only the four allowed fields. |
| `next is not a function` | Fixed in `user.model.js`: do not mix `async` pre-save hooks with `next()`. |
| Upload / Cloudinary errors | `CLOUDNARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `.env` and Cloudinary dashboard. |
| Mongo connection fails | `MONGO_URI`, Atlas network access, VPN/DNS. |
| Missing temp path | Ensure **`public/temp`** exists or Multer destination will error. |

### Author

Created by **Karan _Shishodia_**.
