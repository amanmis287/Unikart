import Order from "../models/Order.js";

/* ------------------ SAVE ORDER (CAFE / STATIONERY) ------------------ */
export const saveOrder = async (req, res) => {
  try {
    const {
      items,
      amount,
      phone,
      address,
      orderType, 
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (!orderType) {
      return res.status(400).json({ error: "orderType is required" });
    }

    const newOrder = new Order({
      userId: req.user.id,
      orderType, 
      items,
      amount,
      phone,
      address,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentStatus: "PAID",
      status: "Pending",
    });

    await newOrder.save();

    res.json({
      message: "Order saved successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Order save error:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
};

/* ------------------ SAVE XEROX ORDER ------------------ */
export const createXeroxOrder = async (req, res) => {
  try {
    const {
      fileUrl,
      pages,
      copies,
      color,
      pageSize,
      amount,
    } = req.body;

    const newOrder = new Order({
      userId: req.user.id,
      orderType: "XEROX",
      fileUrl,
      pages,
      copies,
      color,
      pageSize,
      amount,
      paymentStatus: "PENDING",
      status: "Pending",
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Xerox order error:", error);
    res.status(500).json({ error: "Failed to create xerox order" });
  }
};

/* ------------------ USER: MY ORDERS ------------------ */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

/* ------------------ VENDOR: ALL ORDERS ------------------ */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
};

/* ------------------ UPDATE ORDER STATUS ------------------ */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Accepted",
      "Preparing",
      "Dispatched",
      "Completed",
      "Canceled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
};
