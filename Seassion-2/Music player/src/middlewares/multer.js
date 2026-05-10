// Saves uploaded files to ./public/temp — ensure that folder exists before uploads.
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const fileUpload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB — enough for a quick test file
});
 
export default fileUpload