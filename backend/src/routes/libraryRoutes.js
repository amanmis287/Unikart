import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import LibraryBook from "../models/LibraryBook.js";
import LibraryRent from "../models/LibraryRent.js";

const router = express.Router();

/* ================= GET ALL AVAILABLE BOOKS ================= */
router.get("/books", async (req, res) => {
  try {
    const books = await LibraryBook.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

/* ================= RENT A BOOK (AFTER PAYMENT) ================= */
router.post("/rent", authMiddleware, async (req, res) => {
  try {
    const {
      bookId,
      weeks,
      amount,
      phone,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (
      !bookId ||
      !weeks ||
      !amount ||
      !phone ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const rent = await LibraryRent.create({
      userId: req.user._id,
      bookId,
      weeks,
      amount,
      phone,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: "REQUESTED",
      paymentStatus: "PAID",
    });

    res.status(201).json(rent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create rent request" });
  }
});

/* ================= USER RENT HISTORY ================= */
router.get("/my-rents", authMiddleware, async (req, res) => {
  try {
    const rents = await LibraryRent.find({ userId: req.user._id })
      .populate("bookId", "title author image")
      .sort({ createdAt: -1 });

    res.json(rents);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rents" });
  }
});

export default router;
