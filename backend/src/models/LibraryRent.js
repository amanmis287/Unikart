import mongoose from "mongoose";

const libraryRentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LibraryBook",
      required: true,
    },

    weeks: {
      type: Number,
      min: 1,
      max: 4,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    /* ===== RAZORPAY DETAILS ===== */
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
      required: true,
    },
    razorpaySignature: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["REQUESTED", "AVAILED", "DONE"],
      default: "REQUESTED",
    },

    paymentStatus: {
      type: String,
      enum: ["PAID"],
      default: "PAID",
    },
  },
  { timestamps: true }
);

export default mongoose.model("LibraryRent", libraryRentSchema);
