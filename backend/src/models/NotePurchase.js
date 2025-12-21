import mongoose from "mongoose";

const notePurchaseSchema = new mongoose.Schema(
  {
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentId: String,
  },
  { timestamps: true }
);

export default mongoose.model("NotePurchase", notePurchaseSchema);
