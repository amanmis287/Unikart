import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import LibraryBook from "../models/LibraryBook.js";
import LibraryRent from "../models/LibraryRent.js";

const router = express.Router();

/* ================= GET ALL BOOKS (VENDOR) ================= */
router.get("/books", authMiddleware, async (req, res) => {
  try {
    const books = await LibraryBook.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

/* ================= ADD BOOK ================= */
router.post("/add-book", authMiddleware, async (req, res) => {
  try {
    const { title, author, pricePerWeek, image } = req.body;

    const book = await LibraryBook.create({
      title,
      author,
      pricePerWeek,
      image,
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: "Failed to add book" });
  }
});

/* ================= TOGGLE AVAILABILITY ================= */
router.put("/toggle/:id", authMiddleware, async (req, res) => {
  try {
    const book = await LibraryBook.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.available = !book.available;
    await book.save();

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle availability" });
  }
});

/* ================= DELETE BOOK ================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await LibraryBook.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete book" });
  }
});

/* ================= ALL RENT REQUESTS ================= */
router.get("/rents", authMiddleware, async (req, res) => {
  try {
    const rents = await LibraryRent.find()
      .populate("userId", "name")
      .populate("bookId", "title author")
      .sort({ createdAt: -1 });

    res.json(rents);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rent requests" });
  }
});

/* ================= UPDATE RENT STATUS ================= */
router.put("/rent/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["REQUESTED", "AVAILED", "DONE"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const rent = await LibraryRent.findById(req.params.id);
    if (!rent) return res.status(404).json({ message: "Rent not found" });

    rent.status = status;
    await rent.save();

    res.json(rent);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

export default router;
