import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    images: [String], // max 5 image URLs

    eventDate: Date, // optional

    postedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
