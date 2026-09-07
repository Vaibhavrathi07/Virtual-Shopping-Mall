const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").get(admin, getAllOrders).post(createOrder);
router.get("/my", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", admin, updateOrderStatus);

module.exports = router;
