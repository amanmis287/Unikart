import express from "express";
import razorpay from "../config/razorpay.js";
import NotePurchase from "../models/NotePurchase.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* CREATE ORDER */
router.post("/create", authMiddleware, async (req, res) => {
  const order = await razorpay.orders.create({
    amount: req.body.amount * 100,
    currency: "INR",
  });
  res.json(order);
});

/* VERIFY PAYMENT */
router.post("/verify", authMiddleware, async (req, res) => {
  await NotePurchase.create({
    noteId: req.body.noteId,
    userId: req.user._id,
    paymentId: req.body.paymentId,
  });

  res.json({ success: true });
});

export default router;
