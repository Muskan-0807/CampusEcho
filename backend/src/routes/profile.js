const express = require("express");
const profileRouter = express.Router();
const { authMiddleware } = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { validateUpdateProfileData } = require("../utils/validation");

profileRouter.get("/me", authMiddleware, async (req, res) => {
  if (req.user.role === "admin") {
    return res.status(403).json({
      message: "Admin does not have a profile",
    });
  }
  res.status(200).json({
    user: req.user,
  });
});

profileRouter.patch("/change-password", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({
        message: "Admin does not have a profile",
      });
    }
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }

    const user = await User.findById(req.user._id);

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.password = newPasswordHash;

    await user.save();
    res.status(200).json({
      message: " Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      message: "Server error while changing password",
    });
  }
});

profileRouter.patch("/update", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({
        message: "Admin does not have a profile",
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "No fields provided to update",
      });
    }

    const isEditAllowed = validateUpdateProfileData(req);
    if (!isEditAllowed) {
      return res.status(400).json({
        message: "Invalid fields in profile update",
      });
    }

    Object.keys(req.body).forEach((key)=>(req.user[key]= req.body[key]));
    await req.user.save(),


    res.status(200).json({
      message: "Profile updated successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating profile",
    });
  }
});

module.exports = profileRouter;
