import mongoose from "mongoose";

const cafeItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  available: { type: Boolean, default: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const CafeItem = mongoose.model("CafeItem", cafeItemSchema);
export default CafeItem;
