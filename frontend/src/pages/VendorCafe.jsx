import React, { useState, useEffect } from "react";
import "../styles/VendorCafe.css";

const VendorCafe = () => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  /* ---------------- MENU ITEMS ---------------- */
  const loadItems = () => {
    fetch("http://localhost:5000/api/cafe")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    loadItems();
  }, []);

  /* ---------------- ADD ITEM ---------------- */
  const handleAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/api/cafe/add", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Upload failed");

      loadItems();
      setName("");
      setPrice("");
      setImage(null);
      alert("Item added successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- TOGGLE AVAILABILITY ---------------- */
  const toggleAvailability = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/cafe/${id}/availability`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) return alert("Failed");
      loadItems();
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- DELETE ITEM ---------------- */
  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/cafe/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return alert("Delete failed");
      loadItems();
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- VENDOR ORDERS (CAFÉ ONLY) ---------------- */
  const loadOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const cafeOrders = data.filter(
        (o) => o.orderType === "CAFE"
      );

      setOrders(cafeOrders);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const statusOptions = [
    "Pending",
    "Accepted",
    "Preparing",
    "Dispatched",
    "Completed",
    "Canceled",
  ];

  return (
    <div className="vendor-cafe-container">
      <header className="vendor-hero">
        <h1>Vendor Café Dashboard ☕</h1>
        <p>Manage your café menu & orders.</p>
      </header>

      <div className="vendor-tabs">
        <button
          onClick={() => setShowOrders(false)}
          className={!showOrders ? "active" : ""}
        >
          Menu
        </button>
        <button
          onClick={() => {
            setShowOrders(true);
            loadOrders();
          }}
          className={showOrders ? "active" : ""}
        >
          Orders
        </button>
      </div>

      {!showOrders && (
        <>
          <section className="add-item-section">
            <h2>Add New Café Item</h2>
            <form onSubmit={handleAddItem} className="add-item-form">
              <input
                type="text"
                placeholder="Item Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Price (₹)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
              <button type="submit">Add Item</button>
            </form>
          </section>

          <section className="items-section">
            <h2>Your Café Items</h2>
            <div className="items-grid">
              {items.map((item) => (
                <div key={item._id} className="item-card">
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p
                    className={`availability ${
                      item.available ? "on" : "off"
                    }`}
                  >
                    {item.available ? "Available" : "Not Available"}
                  </p>
                  <button
                    className="toggle-btn"
                    onClick={() => toggleAvailability(item._id)}
                  >
                    {item.available ? "Set Unavailable" : "Set Available"}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteItem(item._id)}
                  >
                    Delete Item
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {showOrders && (
        <section className="orders-section">
          <h2>Café Orders 📦</h2>

          {orders.length === 0 ? (
            <p>No café orders yet.</p>
          ) : (
            <div className="orders-grid">
              {orders.map((o) => (
                <div key={o._id} className="order-card">
                  <p><strong>Order ID:</strong> {o._id.slice(-8)}</p>
                  <p><strong>User:</strong> {o.userId?.name || "Unknown"}</p>
                  <p><strong>Phone:</strong> {o.phone}</p>
                  <p><strong>Address:</strong> {o.address}</p>

                  <div className="order-items">
                    {o.items.map((it, idx) => (
                      <p key={idx}>
                        {it.name} x{it.quantity} • ₹{it.price}
                      </p>
                    ))}
                  </div>

                  <div className="status-section">
                    <label>Status:</label>
                    <select
                      value={o.status}
                      onChange={(e) =>
                        updateStatus(o._id, e.target.value)
                      }
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default VendorCafe;
