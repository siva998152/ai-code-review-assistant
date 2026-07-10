const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

const authenticateUser = require("../middleware/authMiddleware");

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

// Get Profile
router.get("/profile", authenticateUser, getProfile);

// Update Profile
router.put("/profile", authenticateUser, updateProfile);

// Change Password
router.put(
  "/change-password",
  authenticateUser,
  changePassword
);

module.exports = router;