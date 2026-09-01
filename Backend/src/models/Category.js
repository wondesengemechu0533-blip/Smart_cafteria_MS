const mongoose = require("mongoose");

/**
 * Category Schema - For menu categorization
 *
 * Frontend Usage:
 * - menu.html: Category filter buttons
 * - categories.html (Admin): Manage categories
 */
const CategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      en: { type: String, required: true },
      am: { type: String, required: true },
    },
    slug: {
      type: String,
      default: null,
      trim: true,
    },
    icon: {
      type: String,
      default: "🍽️",
    },
    imageUrl: { type: String, default: null },
    description: {
      en: { type: String, default: "" },
      am: { type: String, default: "" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    showOnHomepage: {
      type: Boolean,
      default: false,
    },
    availabilityTime: {
      enabled: { type: Boolean, default: false },
      startTime: { type: String, default: "" },
      endTime: { type: String, default: "" },
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Get localized category name
CategorySchema.methods.getLocalizedName = function (lang = "en") {
  return this.name[lang] || this.name.en || this.id;
};

module.exports = mongoose.model("Category", CategorySchema);
