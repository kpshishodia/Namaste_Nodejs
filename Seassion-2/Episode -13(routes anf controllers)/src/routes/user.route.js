const express = require("express");
const registerUserController = require("../controllers/user.controller.js");
const userRouter = express.Router();
const fileUpload = require("../middlewares/multer.js")

userRouter.route("/register").post(
    fileUpload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 3        
        }
    ]),
    registerUserController)

module.exports = userRouter;