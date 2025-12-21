import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  saveOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  createXeroxOrder,
} from "../controllers/orderController.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/* ------------------ CREATE RAZORPAY ORDER ------------------ */
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await instance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

/* ------------------ CAFE ORDER ------------------ */
router.post("/save", authMiddleware, saveOrder);

/* ------------------ XEROX ORDER ------------------ */
router.post("/xerox", authMiddleware, createXeroxOrder);

/* ------------------ FETCH ORDERS ------------------ */
router.get("/my-orders", authMiddleware, getUserOrders);
router.get("/all", authMiddleware, getAllOrders);

/* ------------------ UPDATE ORDER STATUS ------------------ */
router.put("/:id/status", authMiddleware, updateOrderStatus);

export default router;
