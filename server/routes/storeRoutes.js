const express = require("express");
const {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
} = require("../controllers/storeController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getStores).post(protect, admin, createStore);
router
  .route("/:id")
  .get(getStoreById)
  .put(protect, admin, updateStore)
  .delete(protect, admin, deleteStore);

module.exports = router;
