import mongoose from "mongoose";

const libraryBookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    pricePerWeek: { type: Number, required: true },
    image: { type: String, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("LibraryBook", libraryBookSchema);
