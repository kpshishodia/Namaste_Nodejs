import express from "express"
import registerUserController from "../controllers/Auth/register.controller.js"
import loginUserController from "../controllers/Auth/login.controller.js"
import logOutController from "../controllers/Auth/logOut.controller.js"
import verifyJWT from "../middlewares/verifyJWT.js"
const userRouter = express.Router();




// Auth route map:
// POST /api/v1/auth/register -> create user account
// POST /api/v1/auth/login    -> authenticate existing user
// Register currently expects JSON body as implemented in controller.
userRouter.route("/register").post(
  registerUserController
);

userRouter.route("/login").post(
  loginUserController
)

// protected route

userRouter.route("/logout").post(
  verifyJWT , logOutController
)

export default  userRouter;