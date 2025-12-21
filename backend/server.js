import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.js";
import cafeRoutes from "./src/routes/cafeRoutes.js";
import uploadRoutes from "./src/routes/upload.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import stationeryRoutes from "./src/routes/stationeryRoutes.js";
import xeroxRoutes from "./src/routes/xeroxRoutes.js";
import libraryRoutes from "./src/routes/libraryRoutes.js";
import libraryVendorRoutes from "./src/routes/libraryVendorRoutes.js";
import noteRoutes from "./src/routes/noteRoutes.js";
import notePaymentRoutes from "./src/routes/notePaymentRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/cafe", cafeRoutes);
app.use("/api", uploadRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stationery", stationeryRoutes);
app.use("/api/xerox", xeroxRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/library/vendor", libraryVendorRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/notes/payment", notePaymentRoutes);
app.use("/api/events", eventRoutes);


app.get("/", (req, res) => res.send("API running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
