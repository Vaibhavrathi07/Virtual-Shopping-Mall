const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    brand: { type: String, default: "" },
    images: [{ type: String }],
    // path to a .glb/.gltf model, or null to use a procedural fallback shape
    model3D: { type: String, default: null },
    // fallback used when model3D is missing, so the 3D scene never renders empty
    fallbackShape: {
      type: String,
      enum: ["box", "sphere", "cylinder", "cone", "torus"],
      default: "box",
    },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", brand: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
