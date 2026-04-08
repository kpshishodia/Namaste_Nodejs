const express = require("express");
const registerUserController = require("../controllers/user.controller.js");
const userRouter = express.Router();

userRouter.route("/register").post(registerUserController)

module.exports = userRouter;