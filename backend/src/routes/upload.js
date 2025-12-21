import express from "express";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    return res.json({
      success: true,
      imageUrl: req.file.path || req.file.secure_url,  
      public_id: req.file.filename,                   
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

export default router;
