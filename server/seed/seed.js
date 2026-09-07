require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Category = require("../models/Category");
const Store = require("../models/Store");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const Order = require("../models/Order");
const Review = require("../models/Review");

const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Footwear", slug: "footwear" },
  { name: "Beauty", slug: "beauty" },
  { name: "Home & Living", slug: "home-living" },
  { name: "Sports", slug: "sports" },
];

// Store layout: positions place each storefront around a central mall atrium.
const storeDefs = [
  {
    name: "Tech World",
    slug: "tech-world",
    description: "The latest smartphones, laptops, and gadgets.",
    category: "electronics",
    floor: 1,
    location: { x: -18, y: 0, z: -10, rotationY: 0 },
    theme: { primaryColor: "#3b82f6", accentColor: "#60a5fa" },
  },
  {
    name: "Fashion Avenue",
    slug: "fashion-avenue",
    description: "Trending apparel and accessories for every style.",
    category: "fashion",
    floor: 1,
    location: { x: -6, y: 0, z: -10, rotationY: 0 },
    theme: { primaryColor: "#ec4899", accentColor: "#f472b6" },
  },
  {
    name: "Sole Street",
    slug: "sole-street",
    description: "Sneakers, formal shoes, and everything footwear.",
    category: "footwear",
    floor: 1,
    location: { x: 6, y: 0, z: -10, rotationY: 0 },
    theme: { primaryColor: "#f97316", accentColor: "#fb923c" },
  },
  {
    name: "Beauty Hub",
    slug: "beauty-hub",
    description: "Perfumes, skincare, and makeup essentials.",
    category: "beauty",
    floor: 1,
    location: { x: 18, y: 0, z: -10, rotationY: 0 },
    theme: { primaryColor: "#a855f7", accentColor: "#c084fc" },
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture and decor to elevate any space.",
    category: "home-living",
    floor: 2,
    location: { x: -12, y: 0, z: 10, rotationY: Math.PI },
    theme: { primaryColor: "#22c55e", accentColor: "#4ade80" },
  },
  {
    name: "Sports Zone",
    slug: "sports-zone",
    description: "Gear and apparel for every sport and workout.",
    category: "sports",
    floor: 2,
    location: { x: 12, y: 0, z: 10, rotationY: Math.PI },
    theme: { primaryColor: "#ef4444", accentColor: "#f87171" },
  },
];

// Products per store. model3D is left null intentionally for most items so the
// frontend's procedural fallback (fallbackShape) is demonstrated end-to-end.
const productDefs = {
  "tech-world": [
    { name: "Nova X12 Smartphone", brand: "Nova", price: 45999, discountPrice: 41999, fallbackShape: "box", colors: ["Black", "Silver", "Blue"], sizes: [] },
    { name: "Pulse Pro Laptop 14\"", brand: "Pulse", price: 78999, discountPrice: null, fallbackShape: "box", colors: ["Space Gray"], sizes: [] },
    { name: "Aero Wireless Headphones", brand: "Aero", price: 6999, discountPrice: 5499, fallbackShape: "sphere", colors: ["Black", "White"], sizes: [] },
    { name: "Chrono Smartwatch S2", brand: "Chrono", price: 12999, discountPrice: 10999, fallbackShape: "cylinder", colors: ["Black", "Rose Gold"], sizes: [] },
    { name: "Lumen Mirrorless Camera", brand: "Lumen", price: 89999, discountPrice: null, fallbackShape: "cylinder", colors: ["Black"], sizes: [] },
    { name: "Nova X12 Mini", brand: "Nova", price: 32999, discountPrice: 29999, fallbackShape: "box", colors: ["Black", "White"], sizes: [] },
  ],
  "fashion-avenue": [
    { name: "Classic Crewneck Tee", brand: "Urbane", price: 799, discountPrice: 599, fallbackShape: "box", colors: ["White", "Black", "Navy"], sizes: ["S", "M", "L", "XL"] },
    { name: "Windbreak Bomber Jacket", brand: "Northline", price: 3499, discountPrice: 2799, fallbackShape: "box", colors: ["Olive", "Black"], sizes: ["S", "M", "L", "XL"] },
    { name: "Slim Fit Denim Jeans", brand: "Denimco", price: 2199, discountPrice: null, fallbackShape: "box", colors: ["Indigo", "Black"], sizes: ["30", "32", "34", "36"] },
    { name: "Heritage Analog Watch", brand: "Heritage", price: 4999, discountPrice: 3999, fallbackShape: "cylinder", colors: ["Brown Strap", "Black Strap"], sizes: [] },
    { name: "Canvas Weekender Bag", brand: "Northline", price: 2599, discountPrice: null, fallbackShape: "box", colors: ["Tan", "Charcoal"], sizes: [] },
  ],
  "sole-street": [
    { name: "Stride Runner Sneakers", brand: "Stride", price: 3999, discountPrice: 3199, fallbackShape: "box", colors: ["White", "Black"], sizes: ["7", "8", "9", "10", "11"] },
    { name: "TrailBlaze Running Shoes", brand: "TrailBlaze", price: 5499, discountPrice: null, fallbackShape: "box", colors: ["Grey/Orange"], sizes: ["7", "8", "9", "10", "11"] },
    { name: "Oxford Formal Shoes", brand: "Cobbler & Co.", price: 4499, discountPrice: 3799, fallbackShape: "box", colors: ["Black", "Brown"], sizes: ["7", "8", "9", "10", "11"] },
    { name: "CourtSprint Sports Shoes", brand: "CourtSprint", price: 3299, discountPrice: null, fallbackShape: "box", colors: ["White/Blue"], sizes: ["7", "8", "9", "10", "11"] },
  ],
  "beauty-hub": [
    { name: "Amber Bloom Eau de Parfum", brand: "Maison Vale", price: 3299, discountPrice: 2799, fallbackShape: "cylinder", colors: [], sizes: ["50ml", "100ml"] },
    { name: "HydraGlow Skincare Set", brand: "Dermalux", price: 2199, discountPrice: null, fallbackShape: "box", colors: [], sizes: [] },
    { name: "Velvet Matte Lip Kit", brand: "Colorette", price: 1299, discountPrice: 999, fallbackShape: "cylinder", colors: ["Rose", "Nude", "Red"], sizes: [] },
    { name: "Silk Repair Hair Serum", brand: "Dermalux", price: 899, discountPrice: null, fallbackShape: "cylinder", colors: [], sizes: [] },
    { name: "Citrus Splash Cologne", brand: "Maison Vale", price: 2899, discountPrice: 2399, fallbackShape: "cylinder", colors: [], sizes: ["50ml", "100ml"] },
  ],
  "home-living": [
    { name: "Nordic Lounge Chair", brand: "Woodline", price: 8999, discountPrice: 7499, fallbackShape: "box", colors: ["Walnut", "Oak"], sizes: [] },
    { name: "Extendable Dining Table", brand: "Woodline", price: 15999, discountPrice: null, fallbackShape: "box", colors: ["Walnut"], sizes: [] },
    { name: "Arc Floor Lamp", brand: "Luma", price: 3499, discountPrice: 2999, fallbackShape: "cone", colors: ["Black", "Brass"], sizes: [] },
    { name: "Cloud Comfort Sofa (3-seater)", brand: "Woodline", price: 28999, discountPrice: 24999, fallbackShape: "box", colors: ["Grey", "Beige"], sizes: [] },
    { name: "Ceramic Accent Vase Set", brand: "Luma", price: 1499, discountPrice: null, fallbackShape: "cylinder", colors: ["Terracotta", "White"], sizes: [] },
  ],
  "sports-zone": [
    { name: "Pro Match Football", brand: "Kicksport", price: 1299, discountPrice: 999, fallbackShape: "sphere", colors: [], sizes: ["5"] },
    { name: "ProGrip Basketball", brand: "Hoopline", price: 1599, discountPrice: null, fallbackShape: "sphere", colors: [], sizes: ["7"] },
    { name: "AllRounder Cricket Kit Bag", brand: "Boundary", price: 4999, discountPrice: 4199, fallbackShape: "box", colors: ["Black/Red"], sizes: [] },
    { name: "FlexFit Adjustable Dumbbells", brand: "IronCore", price: 6999, discountPrice: 5999, fallbackShape: "cylinder", colors: [], sizes: [] },
    { name: "DriFit Training Tee", brand: "IronCore", price: 899, discountPrice: null, fallbackShape: "box", colors: ["Black", "Grey"], sizes: ["S", "M", "L", "XL"] },
    { name: "Yoga & Training Mat", brand: "FlexFit", price: 1199, discountPrice: 949, fallbackShape: "box", colors: ["Teal", "Purple"], sizes: [] },
  ],
};

const run = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Store.deleteMany(),
    Product.deleteMany(),
    Cart.deleteMany(),
    Wishlist.deleteMany(),
    Order.deleteMany(),
    Review.deleteMany(),
  ]);

  console.log("Seeding categories...");
  const createdCategories = await Category.insertMany(categories);
  const categoryBySlug = Object.fromEntries(createdCategories.map((c) => [c.slug, c]));

  console.log("Seeding stores...");
  const createdStores = await Store.insertMany(storeDefs);
  const storeBySlug = Object.fromEntries(createdStores.map((s) => [s.slug, s]));

  console.log("Seeding products...");
  const productsToInsert = [];
  for (const [storeSlug, products] of Object.entries(productDefs)) {
    const store = storeBySlug[storeSlug];
    const categorySlug = storeDefs.find((s) => s.slug === storeSlug).category;
    const category = categoryBySlug[categorySlug];

    products.forEach((p, idx) => {
      productsToInsert.push({
        ...p,
        description: `${p.name} from ${p.brand}, available now at ${store.name}.`,
        category: category._id,
        store: store._id,
        images: [],
        model3D: null,
        stock: 15 + ((idx * 7) % 40),
        rating: Number((3.5 + ((idx * 0.37) % 1.5)).toFixed(1)),
        numReviews: 5 + (idx % 20),
        featured: idx % 4 === 0,
      });
    });
  }
  await Product.insertMany(productsToInsert);

  console.log("Seeding demo users...");
  await User.create({
    name: "Demo User",
    email: "demo@virtualmall.com",
    password: "Demo@123",
    role: "user",
  });
  await User.create({
    name: "Mall Admin",
    email: "admin@virtualmall.com",
    password: "Admin@123",
    role: "admin",
  });

  console.log(`Seed complete: ${createdStores.length} stores, ${productsToInsert.length} products.`);
  console.log("Demo login:  demo@virtualmall.com  / Demo@123");
  console.log("Admin login: admin@virtualmall.com / Admin@123");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
