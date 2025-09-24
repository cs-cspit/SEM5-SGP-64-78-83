const User = require("../models/User");
const ClientDetails = require("../models/ClientDetails");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {
  sendPasswordResetEmail,
  sendEmailVerificationEmail,
} = require("../services/emailService");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      // If user exists but email is not verified, allow resending verification
      if (!userExists.isEmailVerified) {
        return res.status(400).json({
          message:
            "Account already exists but email not verified. Please check your email or request a new verification link.",
          needsVerification: true,
          email: email,
        });
      }
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Create user with default role 'user' and email unverified
    const user = await User.create({
      name,
      email,
      password,
      role: "user",
      isEmailVerified: false,
    });

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const emailResult = await sendEmailVerificationEmail({
      name: user.name,
      email: user.email,
      token: verificationToken,
    });

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Don't fail registration if email fails, but log it
    }

    res.status(201).json({
      message:
        "Registration successful! Please check your email to verify your account.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      emailSent: emailResult.success,
      requiresVerification: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    console.log("User found:", user ? "Yes" : "No");

    // First check if user exists
    if (!user) {
      return res
        .status(401)
        .json({ message: "No account found with this email" });
    }

    console.log("User role:", user.role);

    // Then check password
    try {
      const isValidPassword = await user.comparePassword(password);
      console.log("Password validation result:", isValidPassword);

      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }
    } catch (error) {
      console.error("Password comparison error:", error);
      return res.status(500).json({ message: "Error verifying password" });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        message:
          "Please verify your email address before logging in. Check your email for verification link.",
        needsVerification: true,
        email: user.email,
      });
    }

    const token = generateToken(user._id);

    // Log successful login
    console.log("Login successful for user:", {
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["user", "client", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent removing the last admin
    if (user.role === "admin" && role === "client") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res
          .status(400)
          .json({ message: "Cannot remove the last admin" });
      }
    }

    user.role = role;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting the last admin
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({
          message: "Cannot delete the last admin user",
        });
      }
    }

    // Prevent users from deleting themselves
    if (req.user._id.toString() === userId) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    // If user is a client, also delete their client details
    if (user.role === "client") {
      console.log(`Deleting client details for user: ${userId}`);
      try {
        // Convert userId to ObjectId for proper matching
        const objectId = new mongoose.Types.ObjectId(userId);
        const deletedClientDetails = await ClientDetails.findOneAndDelete({
          userId: objectId,
        });
        console.log(
          "Client details found and deleted:",
          deletedClientDetails ? "Yes" : "No"
        );
        if (deletedClientDetails) {
          console.log(
            "Deleted client details for company:",
            deletedClientDetails.companyName
          );
        } else {
          console.log("No client details found for userId:", userId);
        }
      } catch (clientDeleteError) {
        console.error("Error deleting client details:", clientDeleteError);
      }
    }

    await User.findByIdAndDelete(userId);
    console.log(`User deleted: ${userId}`);

    res.json({
      message: "User deleted successfully",
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate email format
    if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal whether user exists or not for security
      return res.status(200).json({
        message:
          "If an account with this email exists, you will receive a password reset link",
      });
    }

    // Generate reset token
    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Send reset email
    const emailResult = await sendPasswordResetEmail({
      name: user.name,
      email: user.email,
      token: resetToken,
    });

    if (!emailResult.success) {
      // Clear the reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        message: "Failed to send password reset email. Please try again.",
      });
    }

    res.status(200).json({
      message: "Password reset link sent to your email address",
      emailSent: true,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: { $ne: null },
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user || !user.verifyResetPasswordToken(token)) {
      return res.status(400).json({
        message:
          "Invalid or expired reset token. Please request a new password reset.",
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      message:
        "Password reset successful. You can now login with your new password.",
      success: true,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    // Find user with valid verification token
    const user = await User.findOne({
      emailVerificationToken: { $ne: null },
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user || !user.verifyEmailVerificationToken(token)) {
      return res.status(400).json({
        message:
          "Invalid or expired verification token. Please request a new verification email.",
        expired: true,
      });
    }

    // Mark email as verified
    user.markEmailAsVerified();
    await user.save();

    res.status(200).json({
      message:
        "Email verified successfully! You can now log in to your account.",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Resend verification email
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "No account found with this email address" });
    }

    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({
          message: "Email is already verified. You can log in normally.",
        });
    }

    // Generate new verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const emailResult = await sendEmailVerificationEmail({
      name: user.name,
      email: user.email,
      token: verificationToken,
    });

    if (!emailResult.success) {
      return res.status(500).json({
        message: "Failed to send verification email. Please try again.",
      });
    }

    res.status(200).json({
      message: "Verification email sent successfully. Please check your email.",
      emailSent: true,
    });
  } catch (error) {
    console.error("Resend verification email error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
