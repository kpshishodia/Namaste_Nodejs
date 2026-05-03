import express from "express"
import verifyJWT from "../middlewares/verifyJWT.js";
import createMusic from "../controllers/Music/music.controller.js";
import verifyArtist from "../middlewares/role";

const musicRouter = express.Router()

musicRouter.post(
  "/create-music",
  verifyJWT,
  verifyArtist,
  createMusic
);
export default musicRouter