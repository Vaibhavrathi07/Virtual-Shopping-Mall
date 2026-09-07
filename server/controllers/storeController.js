const asyncHandler = require("express-async-handler");
const Store = require("../models/Store");
const Product = require("../models/Product");

// @desc    Get all stores
// @route   GET /api/stores
// @access  Public
const getStores = asyncHandler(async (req, res) => {
  const stores = await Store.find().sort({ floor: 1, name: 1 });
  res.json({ success: true, data: stores });
});

// @desc    Get single store with its products
// @route   GET /api/stores/:id
// @access  Public
const getStoreById = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    res.status(404);
    throw new Error("Store not found");
  }
  const products = await Product.find({ store: store._id }).populate("category", "name slug");
  res.json({ success: true, data: { ...store.toObject(), products } });
});

// @desc    Create store
// @route   POST /api/stores
// @access  Private/Admin
const createStore = asyncHandler(async (req, res) => {
  const store = await Store.create(req.body);
  res.status(201).json({ success: true, data: store });
});

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private/Admin
const updateStore = asyncHandler(async (req, res) => {
  const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!store) {
    res.status(404);
    throw new Error("Store not found");
  }
  res.json({ success: true, data: store });
});

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private/Admin
const deleteStore = asyncHandler(async (req, res) => {
  const store = await Store.findByIdAndDelete(req.params.id);
  if (!store) {
    res.status(404);
    throw new Error("Store not found");
  }
  res.json({ success: true, data: {} });
});

module.exports = { getStores, getStoreById, createStore, updateStore, deleteStore };
