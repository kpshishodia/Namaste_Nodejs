const express = require("express");
const registerUserController = require("../controllers/user.controller.js");
const userRouter = express.Router();

// Multer instance: saves uploads under ./public/temp (see middlewares/multer.js)
const fileUpload = require("../middlewares/multer.js");

// POST /api/v1/users/register — multipart/form-data only (not raw JSON).
// File field names MUST match exactly: "avatar" and "coverImage" (case-sensitive).
userRouter.route("/register").post(
  fileUpload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 3 },
  ]),
  registerUserController
);

module.exports = userRouter;