const express = require("express");
const { getStats, getUsers } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, admin);
router.get("/stats", getStats);
router.get("/users", getUsers);

module.exports = router;
