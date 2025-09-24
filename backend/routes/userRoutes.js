const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  updateUserRole,
  getProfile,
  deleteUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} = require("../controllers/userController");
const { auth, adminAuth } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

// Protected routes
router.get("/profile", auth, getProfile);

// Admin routes
router.get("/all", adminAuth, getAllUsers);
router.patch("/role", adminAuth, updateUserRole);
router.delete("/:userId", adminAuth, deleteUser);

module.exports = router;
