import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addStationeryItem,
  getStationeryItems,
  getVendorStationeryItems,
  toggleAvailability,
  deleteStationeryItem,
} from "../controllers/stationeryController.js";

const router = express.Router();

/* ------------------ USER ------------------ */
// Get all available stationery items
router.get("/", getStationeryItems);

/* ------------------ VENDOR ------------------ */
// Add stationery item
router.post("/add", authMiddleware, addStationeryItem);

// Get vendor's stationery items
router.get("/vendor", authMiddleware, getVendorStationeryItems);

// Toggle availability
router.put("/toggle/:id", authMiddleware, toggleAvailability);

// Delete stationery item
router.delete("/:id", authMiddleware, deleteStationeryItem);

export default router;
