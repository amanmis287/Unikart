import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["student", "vendor", "faculty"], default: "student" },
  vendorType: { type: String, enum: ['cafe', 'xerox', 'library'], required: function() { return this.role === 'vendor'; } },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
