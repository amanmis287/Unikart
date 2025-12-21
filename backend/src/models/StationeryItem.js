import mongoose from "mongoose";

const stationeryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String, 
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("StationeryItem", stationeryItemSchema);
