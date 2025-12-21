import express from "express";
import Event from "../models/Event.js";
import upload from "../middleware/eventUpload.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* CREATE EVENT */
router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  async (req, res) => {
    const images = req.files.map((file) => file.path); 

    const event = await Event.create({
      title: req.body.title,
      description: req.body.description,
      eventDate: req.body.eventDate || null,
      images,
      postedBy: {
        userId: req.user._id,
        name: req.user.name,
      },
    });

    res.json(event);
  }
);

/* GET EVENTS (auto remove expired) */
router.get("/", async (req, res) => {
  await Event.deleteMany({
    eventDate: { $lt: new Date() },
  });

  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

export default router;
