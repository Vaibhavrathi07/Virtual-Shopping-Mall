const express = require("express");
const { getCategories, createCategory, deleteCategory } = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getCategories).post(protect, admin, createCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
