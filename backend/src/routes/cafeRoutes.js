import express from "express";
import CafeItem from "../models/CafeItem.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Add a new café item (with image upload)
router.post("/add", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;

    // Only vendor with cafe type can add
    if (req.user.role !== "vendor" || req.user.vendorType !== "cafe") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get Cloudinary URL
    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const newItem = new CafeItem({
      name,
      price,
      image: imageUrl,
      vendorId: req.user.id,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all café items (public)
router.get("/", async (req, res) => {
  try {
    const items = await CafeItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// Toggle availability
router.put("/:id/availability", authMiddleware, async (req, res) => {
  try {
    const item = await CafeItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.vendorId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    item.available = !item.available;
    await item.save();
    res.json({ message: "Availability updated", item });
  } catch (err) {
    res.status(500).json({ message: "Failed to update availability" });
  }
});

// Delete item
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await CafeItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.vendorId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item" });
  }
});

export default router;