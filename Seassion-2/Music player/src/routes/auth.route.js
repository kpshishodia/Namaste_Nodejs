// ============================================================
// src/routes/auth.route.js — auth API routes
// ============================================================
// Mounted at: /api/v1/auth (see src/app.js)
//
// Auth route map:
// POST /api/v1/auth/register       -> create user account (public, JSON body)
// POST /api/v1/auth/login          -> authenticate existing user (public, JSON body)
// POST /api/v1/auth/logout         -> protected: verifyJWT → logout controller
// POST /api/v1/auth/refresh-token  -> protected: verifyJWT → refresh access token
// ============================================================

import express from "express"
import registerUserController from "../controllers/Auth/register.controller.js"
import loginUserController from "../controllers/Auth/login.controller.js"
import logOutController from "../controllers/Auth/logout.controller.js"
import refreshAccessToken from "../controllers/Auth/refreshAccessToken.js"
import verifyJWT from "../middlewares/verifyJWT.js"
import getProfileController from "../controllers/Auth/getProfile.controller.js"
const userRouter = express.Router();

// Public routes — no verifyJWT
userRouter.route("/register").post(
  registerUserController
);

userRouter.route("/login").post(
  loginUserController
)

// Protected routes — verifyJWT runs before controller

userRouter.route("/logout").post(
  verifyJWT , logOutController
)

userRouter.route("/refresh-token").post(
  verifyJWT , refreshAccessToken
)

userRouter.route("/profile").get(
  verifyJWT , getProfileController
)

export default  userRouter;