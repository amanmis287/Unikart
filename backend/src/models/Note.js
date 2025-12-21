import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    fileUrl: { type: String, required: true },
    fileName: String,

    isPaid: { type: Boolean, default: false },
    price: { type: Number, default: 0 },

    uploadedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
