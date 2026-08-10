
import User from "../../models/user.model.js";

const updateProfileController = async (req, res) => {
  try {
    // ==========================================
    // 1. ALLOWED TEXT FIELD NAMES
    // ==========================================

    const requestFields = Object.keys(req.body);

    const allowedTextFieldsUpdate = [
      "userName",
      "age",
      "about",
      "skills",
    ];

    const isValidTextFieldsUpdate = requestFields.every((field) => {
      return allowedTextFieldsUpdate.includes(field);
    });

    if (!isValidTextFieldsUpdate) {
      return res.status(400).json({
        message: "Only allowed profile fields can be updated.",
      });
    }


    // ==========================================
    // 2. VALIDATE TEXT FIELD VALUES
    // ==========================================

    // userName
    if (req.body.userName !== undefined) {
      if (typeof req.body.userName !== "string") {
        return res.status(400).json({
          message: "Username must be a string.",
        });
      }

      const userName = req.body.userName.trim();

      if (userName.length < 3 || userName.length > 30) {
        return res.status(400).json({
          message: "Username must be between 3 and 30 characters.",
        });
      }
    }


    // age
    if (req.body.age !== undefined) {
      if (
        !Number.isInteger(req.body.age) ||
        req.body.age < 13 ||
        req.body.age > 120
      ) {
        return res.status(400).json({
          message: "Age must be an integer between 13 and 120.",
        });
      }
    }


    // about
    if (req.body.about !== undefined) {
      if (typeof req.body.about !== "string") {
        return res.status(400).json({
          message: "About must be a string.",
        });
      }

      if (req.body.about.length > 500) {
        return res.status(400).json({
          message: "About must not exceed 500 characters.",
        });
      }
    }


    // skills
    if (req.body.skills !== undefined) {
      if (!Array.isArray(req.body.skills)) {
        return res.status(400).json({
          message: "Skills must be an array.",
        });
      }

      const areSkillsValid = req.body.skills.every((skill) => {
        return (
          typeof skill === "string" &&
          skill.trim().length > 0
        );
      });

      if (!areSkillsValid) {
        return res.status(400).json({
          message: "Each skill must be a non-empty string.",
        });
      }
    }


    // ==========================================
    // 3. ALLOWED FILE FIELD NAMES
    // ==========================================

    const allowedFilesFields = [
      "coverImage",
      "avatar",
    ];

    // Files are optional for PATCH
    if (req.files) {
      const requestFilesFields = Object.keys(req.files);

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


      // ==========================================
      // 4. VALIDATE ACTUAL FILES
      // ==========================================

      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      const maxFileSize = 5 * 1024 * 1024; // 5 MB


      // ---------- Avatar ----------

      if (req.files.avatar) {
        const avatar = req.files.avatar[0];

        if (!allowedMimeTypes.includes(avatar.mimetype)) {
          return res.status(400).json({
            message: "Avatar must be a JPEG, PNG, or WebP image.",
          });
        }

        if (avatar.size > maxFileSize) {
          return res.status(400).json({
            message: "Avatar must not exceed 5 MB.",
          });
        }
      }


      // ---------- Cover Image ----------

      if (req.files.coverImage) {
        const coverImage = req.files.coverImage[0];

        if (!allowedMimeTypes.includes(coverImage.mimetype)) {
          return res.status(400).json({
            message: "Cover image must be a JPEG, PNG, or WebP image.",
          });
        }

        if (coverImage.size > maxFileSize) {
          return res.status(400).json({
            message: "Cover image must not exceed 5 MB.",
          });
        }
      }
    }


    // ==========================================
    // EVERYTHING IS VALID
    // ==========================================

    // Next:
    // 1. Find user
    // 2. Upload avatar/cover to Cloudinary
    // 3. Build updateData
    // 4. Save/update MongoDB
    // 5. Delete old Cloudinary images


  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default updateProfileController;

