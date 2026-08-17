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
// import registerUserController from "../controllers/Auth/register.controller.js"
import registerUserController from "../controllers/Auth/register2.controller.js"
import loginUserController from "../controllers/Auth/login2.controller.js"
import logOutController from "../controllers/Auth/logout2.controller.js"
import refreshAccessToken from "../controllers/Auth/refreshAccess2Token.js"
import verifyJWT from "../middlewares/verify2JWT.js"
import getProfileController from "../controllers/Auth/getProfile.controller.js"
import updatePaswwordController from "../controllers/Profile/updatePassword2.controller.js"
import updateProfileController from "../controllers/Profile/updateProfile2.controller.js"
import fileUpload from "../../src/middlewares/multer.js"
const userRouter = express.Router();

// Public routes — no verifyJWT
userRouter.route("/register").post(
  fileUpload.fields([
    {name: "avatar" , maxCount: 1},
    {name: "coverImage" , maxCount: 2}
  ]),
  registerUserController
);

userRouter.route("/login").post(
  loginUserController
)

userRouter.route("/refresh-token").post(
  refreshAccessToken
);

// Protected routes — verifyJWT runs before controller

userRouter.route("/logout").post(
  verifyJWT , logOutController
)

userRouter.route("/profile").get(
  verifyJWT , getProfileController
)

userRouter.route("/updatePassword").patch(
  verifyJWT , updatePaswwordController
)

userRouter.route("/updateProfile").patch(
  verifyJWT , fileUpload.fields([
    {name: "avatar" , maxCount: 1},
    {name: "coverImage" , maxCount: 1}
  ]),  updateProfileController
)

export default  userRouter;