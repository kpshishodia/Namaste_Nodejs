## Professional Backend Setup – Routes & Controllers

This project is a **Node.js + Express + MongoDB** backend, structured in a professional way with separate layers for the app configuration, database connection, models, middleware, and services.

### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (via Mongoose)
- **Auth & Security**: JSON Web Tokens (JWT), bcrypt
- **File Uploads**: Multer
- **Media Storage**: Cloudinary
- **Validation**: validator

### Project Structure (important files)

- `server.js` – Entry point. Connects to MongoDB and starts the HTTP server using the Express app from `src/app.js`.
- `src/app.js` – Configures the Express app (CORS, JSON parsing, URL-encoded parsing, static files, cookies). This is where you would plug in your routes/controllers.
- `src/DB/Database.js` – Sets up and exports the MongoDB connection function.
- `src/models/user.model.js` – Mongoose model for users, including password hashing, JWT token helpers, and validations.
- `src/models/video.model.js` – Mongoose model for videos, with fields for URLs, owner, views, likes, etc., and an aggregate pagination plugin.
- `src/middlewares/multer.js` – Multer configuration for handling file uploads to a temporary folder.
- `src/services/cloudinaryService.js` – Helper to upload files from the temp folder to Cloudinary and then remove them locally.

### Environment Variables (.env)

Create a `.env` file in the root of this folder with values similar to:

```env
PORT=8000

MONGO_URI=mongodb://localhost:27017
DB_NAME=your_database_name

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CORS_ORIGIN=http://localhost:3000
```

Adjust the values according to your local setup or deployment configuration.

### How to Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   node server.js
   ```

3. The server will start **after MongoDB connects successfully**, and listen on `PORT` from `.env` or fallback `8000`.

### Author

Created by **kpssh**.

