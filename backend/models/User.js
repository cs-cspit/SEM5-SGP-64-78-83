const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "client", "admin"],
      default: "user",
      required: true,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    try {
      user.password = await bcrypt.hash(user.password, 8);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// Generate password reset token
userSchema.methods.generateResetPasswordToken = function () {
  const crypto = require("crypto");

  // Generate random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire time (10 minutes)
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  // Return unhashed token
  return resetToken;
};

// Verify password reset token
userSchema.methods.verifyResetPasswordToken = function (token) {
  const crypto = require("crypto");

  // Hash the token and compare
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Check if token matches and hasn't expired
  return (
    this.resetPasswordToken === hashedToken &&
    this.resetPasswordExpires > Date.now()
  );
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const crypto = require("crypto");

  // Generate random token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // Hash and set to emailVerificationToken field
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // Set expire time (24 hours)
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

  // Return unhashed token
  return verificationToken;
};

// Verify email verification token
userSchema.methods.verifyEmailVerificationToken = function (token) {
  const crypto = require("crypto");

  // Hash the token and compare
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Check if token matches and hasn't expired
  return (
    this.emailVerificationToken === hashedToken &&
    this.emailVerificationExpires > Date.now()
  );
};

// Mark email as verified
userSchema.methods.markEmailAsVerified = function () {
  this.isEmailVerified = true;
  this.emailVerificationToken = undefined;
  this.emailVerificationExpires = undefined;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
