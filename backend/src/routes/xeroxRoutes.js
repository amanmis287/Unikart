import express from "express";
import xeroxUpload from "../middleware/xeroxMulter.js";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= CREATE XEROX ORDER ================= */
router.post(
  "/",
  authMiddleware,
  xeroxUpload.single("file"),
  async (req, res) => {
    try {
      const { pages, copies, color, pageSize, amount, phone, address } =
        req.body;

      if (!req.file) {
        return res.status(400).json({ message: "File is required" });
      }

      const order = await Order.create({
        userId: req.user._id,
        orderType: "XEROX",

        fileUrl: req.file.path,
        pages: Number(pages),
        copies: Number(copies),
        color: color === "true" || color === true,
        pageSize,

        amount: Number(amount),
        phone,
        address,

        paymentStatus: "PAID",
        razorpayOrderId: req.body.razorpayOrderId,
        razorpayPaymentId: req.body.razorpayPaymentId,
        razorpaySignature: req.body.razorpaySignature,
      });

      res.status(201).json({
        success: true,
        message: "Xerox order placed successfully",
        order,
      });
    } catch (err) {
      console.error("Xerox order error:", err);
      res.status(500).json({
        success: false,
        message: "Xerox order failed",
      });
    }
  }
);

export default router;
