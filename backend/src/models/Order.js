import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Common
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Used for CAFE orders
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "CafeItem" },
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 },
      },
    ],

    // Order type
    orderType: {
      type: String,
      enum: ["CAFE", "XEROX", "STATIONERY"],
      default: "CAFE",
    },

    // Used for XEROX orders
    fileUrl: String,
    pages: Number,
    copies: Number,
    color: Boolean,
    pageSize: String,

    // Common
    amount: {
      type: Number,
      required: true,
    },

    phone: String,
    address: String,

    // Razorpay
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },

    // Delivery / processing status
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Preparing",
        "Dispatched",
        "Completed",
        "Canceled",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
