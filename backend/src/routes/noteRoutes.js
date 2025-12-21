import express from "express";
import Note from "../models/Note.js";
import NotePurchase from "../models/NotePurchase.js";
import upload from "../middleware/noteUpload.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* UPLOAD NOTE */
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  const note = await Note.create({
    title: req.body.title,
    description: req.body.description,
    fileUrl: `/uploads/notes/${req.file.filename}`,
    fileName: req.file.originalname,
    isPaid: req.body.isPaid,
    price: req.body.price,
    uploadedBy: {
      userId: req.user._id,   
      name: req.user.name,
    },
  });

  res.json(note);
});

/* GET ALL NOTES */
router.get("/", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

/* DOWNLOAD NOTE */
router.get("/download/:noteId", authMiddleware, async (req, res) => {
  const note = await Note.findById(req.params.noteId);

  if (!note.isPaid) {
    return res.download("." + note.fileUrl);
  }

  const purchased = await NotePurchase.findOne({
    noteId: note._id,
    userId: req.user._id,   
  });

  if (!purchased) {
    return res.status(403).json({ message: "Payment required" });
  }

  res.download("." + note.fileUrl);
});

export default router;
