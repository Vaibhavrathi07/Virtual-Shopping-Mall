const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Store = require("../models/Store");
const User = require("../models/User");
const Order = require("../models/Order");

// @desc    Dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const [totalProducts, totalStores, totalUsers, orders] = await Promise.all([
    Product.countDocuments(),
    Store.countDocuments(),
    User.countDocuments(),
    Order.find(),
  ]);

  const totalOrders = orders.length;
  const revenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  res.json({
    success: true,
    data: { totalProducts, totalStores, totalUsers, totalOrders, revenue },
  });
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

module.exports = { getStats, getUsers };
