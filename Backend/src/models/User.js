const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const normalizeUserRole = (role) => {
  const value = String(role ?? '').trim();
  if (!value) return 'customer';

  const key = value.toLowerCase();
  const roleMap = {
    customer: 'customer',
    kitchen: 'kitchen',
    foodmaker: 'kitchen',
    'kitchen staff': 'kitchen',
    kitchen_staff: 'kitchen',
    staff: 'kitchen',
    admin: 'admin'
  };

  return roleMap[key] || value;
};

/**
 * User Schema - Matches Frontend Requirements
 *
 * Frontend Usage:
 * - login.html: identifier (email or phone)
 * - register.html: name, email, phone, password
 * - users.js (Admin): role, balance, status
 * - profile.js: name, phone, email, avatar
 */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [
        /^(09|07)[0-9]{8}$/,
        "Please provide a valid Ethiopian phone number (09XXXXXXXX or 07XXXXXXXX)",
      ],
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
      default: null,
    },
    address: {
      type: String,
      trim: true,
      maxlength: [255, "Address cannot exceed 255 characters"],
      default: null,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: [
        "customer",
        "kitchen",
        "admin"
      ],
      default: "customer",
      lowercase: false,
      set: normalizeUserRole,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED", "SUSPENDED"],
      default: "ACTIVE",
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    agreedToTerms: {
      type: Boolean,
      required: [true, "You must agree to the Terms & Conditions"],
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Update updatedAt on save
UserSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: new Date() });
});

// Match password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get user profile without sensitive data
UserSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    username: this.username,
    address: this.address,
    role: this.role,
    balance: this.balance,
    status: this.status,
    avatar: this.avatar,
    createdAt: this.createdAt,
  };
};

UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });

module.exports = mongoose.model("User", UserSchema);
