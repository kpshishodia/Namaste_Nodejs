
import User from "../../models/user.model.js";
import {uploadOnCloudinary} from "../../services/cloudinaryService.js";

const updateProfileController = async (req, res) => {
  try {
    // ============================================================
    // 1. GET REQUESTED TEXT FIELDS
    // ============================================================

    // Object.keys() gives us the names of the fields
    // the client actually sent in req.body.
    //
    // Example:
    // req.body = {
    //   userName: "John",
    //   age: 25
    // }
    //
    // requestFields = ["userName", "age"]

    const requestFields = Object.keys(req.body);

    // These are the ONLY text fields the user is allowed
    // to update through this controller.
    //
    // Password is intentionally NOT here because you have
    // a separate update-password controller.
    const allowedTextFieldsUpdate = [
      "userName",
      "age",
      "about",
      "skills",
    ];


    // Check whether every field sent by the client
    // exists inside our allowed fields array.
    const isValidTextFieldsUpdate = requestFields.every((field) => {
      return allowedTextFieldsUpdate.includes(field);
    });


    // If even one field is not allowed, reject the request.
    if (!isValidTextFieldsUpdate) {
      return res.status(400).json({
        message: "Only allowed profile fields can be updated.",
      });
    }


    // ============================================================
    // 2. VALIDATE TEXT FIELD VALUES
    // ============================================================


    // ---------------- USERNAME ----------------

    if (req.body.userName !== undefined) {

      // Username must be a string.
      if (typeof req.body.userName !== "string") {
        return res.status(400).json({
          message: "Username must be a string.",
        });
      }

      const userName = req.body.userName.trim();

      // Username length validation.
      if (userName.length < 3 || userName.length > 30) {
        return res.status(400).json({
          message: "Username must be between 3 and 30 characters.",
        });
      }
    }


    // ---------------- AGE ----------------

    if (req.body.age !== undefined) {

      // IMPORTANT:
      // If you're using multipart/form-data with Multer,
      // req.body.age may arrive as a STRING, e.g. "25".
      //
      // If your request gives you a number already,
      // Number.isInteger(req.body.age) will work directly.
      //
      // Here we convert it to a number for validation.

      const age = Number(req.body.age);

      if (
        !Number.isInteger(age) ||
        age < 13 ||
        age > 120
      ) {
        return res.status(400).json({
          message: "Age must be an integer between 13 and 120.",
        });
      }
    }


    // ---------------- ABOUT ----------------

    if (req.body.about !== undefined) {

      if (typeof req.body.about !== "string") {
        return res.status(400).json({
          message: "About must be a string.",
        });
      }

      if (req.body.about.trim().length > 500) {
        return res.status(400).json({
          message: "About must not exceed 500 characters.",
        });
      }
    }


    // ---------------- SKILLS ----------------

    if (req.body.skills !== undefined) {
  let requestSkills;

  try {
    requestSkills = JSON.parse(req.body.skills);
  } catch (error) {
    return res.status(400).json({
      message: "Skills must be a valid JSON array.",
    });
  }

  if (!Array.isArray(requestSkills)) {
    return res.status(400).json({
      message: "Skills must be an array.",
    });
  }

  const areSkillsValid = requestSkills.every((requestSkill) => {
    return (
      typeof requestSkill === "string" &&
      requestSkill.trim().length > 0
    );
  });

  if (!areSkillsValid) {
    return res.status(400).json({
      message: "Each skill must be a non-empty string.",
    });
  }
}


    // ============================================================
    // 3. VALIDATE FILE FIELD NAMES
    // ============================================================

    // These are the ONLY files this controller accepts.
    const allowedFilesFields = [
      "avatar",
      "coverImage",
    ];


    // Files are OPTIONAL because this is a PATCH request.
    //
    // Therefore:
    //
    // No files → completely okay
    //
    // Files exist → validate them.

    if (req.files) {

      // If using multer.fields(), req.files looks roughly like:
      //
      // {
      //   avatar: [fileObject],
      //   coverImage: [fileObject]
      // }

      const requestFilesFields = Object.keys(req.files);


      // Check whether every uploaded file field
      // is allowed.
      const isValidFilesFieldsUpdate = requestFilesFields.every(
        (field) => {
          return allowedFilesFields.includes(field);
        }
      );


      if (!isValidFilesFieldsUpdate) {
        return res.status(400).json({
          message: "Only avatar and coverImage can be updated.",
        });
      }


      // ==========================================================
      // 4. VALIDATE ACTUAL FILES
      // ==========================================================

      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      // Maximum file size = 5 MB
      const maxFileSize = 5 * 1024 * 1024;


      // ---------------- AVATAR ----------------

      if (req.files.avatar) {

        // multer.fields() gives us an array,
        // so we get the first uploaded avatar.
        const avatar = req.files.avatar[0];


        // Check file type.
        if (!allowedMimeTypes.includes(avatar.mimetype)) {
          return res.status(400).json({
            message: "Avatar must be a JPEG, PNG, or WebP image.",
          });
        }


        // Check file size.
        if (avatar.size > maxFileSize) {
          return res.status(400).json({
            message: "Avatar must not exceed 5 MB.",
          });
        }
      }


      // ---------------- COVER IMAGE ----------------

      if (req.files.coverImage) {

        const coverImage = req.files.coverImage[0];


        // Check file type.
        if (!allowedMimeTypes.includes(coverImage.mimetype)) {
          return res.status(400).json({
            message:
              "Cover image must be a JPEG, PNG, or WebP image.",
          });
        }


        // Check file size.
        if (coverImage.size > maxFileSize) {
          return res.status(400).json({
            message: "Cover image must not exceed 5 MB.",
          });
        }
      }
    }


    // ============================================================
    // 5. FIND THE CURRENT USER
    // ============================================================

    // verifyJWT middleware has already identified the user
    // and attached information to req.user.
    //
    // We use req.user._id to get the latest user document
    // from MongoDB.

    const user = await User.findById(req.user._id);


    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }


    // ============================================================
    // 6. CREATE updateData
    // ============================================================

    // This object will contain ONLY the things
    // that actually need to be changed.

    const updateData = {};


    // ---------------- TEXT FIELDS ----------------

    if (req.body.userName !== undefined) {
      updateData.userName = req.body.userName.trim();
    }


    if (req.body.age !== undefined) {
      // Convert age to Number because multipart/form-data
      // may give us a string.
      updateData.age = Number(req.body.age);
    }


    if (req.body.about !== undefined) {
      updateData.about = req.body.about.trim();
    }


    if (req.body.skills !== undefined) {
      updateData.skills = req.body.skills;
    }


    // ============================================================
    // 7. UPLOAD AVATAR TO CLOUDINARY
    // ============================================================

    if (req.files?.avatar) {

      const avatar = req.files.avatar[0];


      // IMPORTANT:
      // Multer has already processed the incoming file.
      //
      // Now WE send that file to Cloudinary.

      const avatarCloudinaryResult =
        await uploadOnCloudinary(avatar.path);


      // Make sure Cloudinary actually returned a result.
      if (!avatarCloudinaryResult) {
        return res.status(500).json({
          message: "Avatar upload failed.",
        });
      }


      // Save the new Cloudinary information
      // inside updateData.
      //
      // We store BOTH:
      // url       → display the image
      // public_id → delete the image later

      updateData.avatar = {
        url: avatarCloudinaryResult.url,
        public_id: avatarCloudinaryResult.public_id,
      };
    }


    // ============================================================
    // 8. UPLOAD COVER IMAGE TO CLOUDINARY
    // ============================================================

    if (req.files?.coverImage) {

      const coverImage = req.files.coverImage[0];


      const coverImageCloudinaryResult =
        await uploadOnCloudinary(coverImage.path);


      if (!coverImageCloudinaryResult) {
        return res.status(500).json({
          message: "Cover image upload failed.",
        });
      }


      updateData.coverImage = {
        url: coverImageCloudinaryResult.url,
        public_id: coverImageCloudinaryResult.public_id,
      };
    }


    // ============================================================
    // 9. MAKE SURE THERE IS SOMETHING TO UPDATE
    // ============================================================

    // Example:
    //
    // PATCH request with nothing:
    //
    // {}
    //
    // We don't want to perform an empty database update.

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No profile changes were provided.",
      });
    }


    // ============================================================
    // 10. SAVE CHANGES TO MONGODB
    // ============================================================

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,

      {
        $set: updateData,
      },

      {
        new: true,
      }
    );


    // ============================================================
    // 11. DELETE OLD CLOUDINARY IMAGES
    // ============================================================

    // IMPORTANT:
    //
    // Before replacing the user's avatar/cover,
    // the old information was available in `user`.
    //
    // Example:
    //
    // user.avatar.public_id
    //      ↓
    // "avatars/old123"
    //
    // After successfully updating MongoDB,
    // we can delete the OLD image from Cloudinary.
    //
    // You will call your Cloudinary delete/destroy function here.
    //
    // IMPORTANT:
    // Only delete the old image if a NEW image was uploaded.


    if (
      req.files?.avatar &&
      user.avatar?.public_id
    ) {

      // Example:
      //
      // await deleteFromCloudinary(user.avatar.public_id);
      //
      // Use your own Cloudinary delete service here.
    }


    if (
      req.files?.coverImage &&
      user.coverImage?.public_id
    ) {

      // Example:
      //
      // await deleteFromCloudinary(user.coverImage.public_id);
      //
      // Use your own Cloudinary delete service here.
    }


    // ============================================================
    // 12. SUCCESS RESPONSE
    // ============================================================

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });


  } catch (error) {

    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export default updateProfileController;

