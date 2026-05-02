import express from "express"
import registerUserController from "../controllers/Auth/register.controller.js"
import loginUserController from "../controllers/Auth/login.controller.js"
const userRouter = express.Router();



// POST /api/v1/users/register — multipart/form-data only (not raw JSON).
// File field names MUST match exactly: "avatar" and "coverImage" (case-sensitive).
userRouter.route("/register").post(
  registerUserController
);

userRouter.route("/login").post(
  loginUserController
)

export default  userRouter;