import StationeryItem from "../models/StationeryItem.js";

/* ------------------ ADD STATIONERY ITEM (VENDOR) ------------------ */
export const addStationeryItem = async (req, res) => {
  try {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const item = new StationeryItem({
      name,
      price,
      image,
      vendorId: req.user.id,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Add stationery error:", err);
    res.status(500).json({ error: "Failed to add stationery item" });
  }
};

/* ------------------ GET ALL STATIONERY (USER) ------------------ */
export const getStationeryItems = async (req, res) => {
  try {
    const items = await StationeryItem.find().sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stationery items" });
  }
};

/* ------------------ GET VENDOR STATIONERY ------------------ */
export const getVendorStationeryItems = async (req, res) => {
  try {
    const items = await StationeryItem.find({
      vendorId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch vendor items" });
  }
};

/* ------------------ TOGGLE AVAILABILITY ------------------ */
export const toggleAvailability = async (req, res) => {
  try {
    const item = await StationeryItem.findById(req.params.id);

    if (!item) return res.status(404).json({ error: "Item not found" });

    item.available = !item.available;
    await item.save();

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update availability" });
  }
};

/* ------------------ DELETE STATIONERY ITEM ------------------ */
export const deleteStationeryItem = async (req, res) => {
  try {
    const item = await StationeryItem.findByIdAndDelete(req.params.id);

    if (!item) return res.status(404).json({ error: "Item not found" });

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
};
