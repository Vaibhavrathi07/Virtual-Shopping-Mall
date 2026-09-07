const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    logo: { type: String, default: "" },
    banner: { type: String, default: "" },
    category: { type: String, default: "" },
    floor: { type: Number, default: 1 },
    // position of the storefront inside the 3D mall (world coordinates)
    location: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 },
      rotationY: { type: Number, default: 0 },
    },
    theme: {
      primaryColor: { type: String, default: "#6366f1" },
      accentColor: { type: String, default: "#22d3ee" },
    },
  },
  { timestamps: true }
);

storeSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "store",
});
storeSchema.set("toJSON", { virtuals: true });
storeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Store", storeSchema);
