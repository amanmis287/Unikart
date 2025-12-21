import React, { useEffect, useState, useCallback } from "react";
import "../styles/VendorXerox.css";

const VendorXerox = () => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [orderType, setOrderType] = useState("STATIONERY"); 

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  /* ---------------- STATIONERY ITEMS ---------------- */
  const loadItems = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/stationery/vendor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  /* ---------------- ADD STATIONERY ---------------- */
  const handleAddItem = async (e) => {
    e.preventDefault();

    try {
      const imgData = new FormData();
      imgData.append("image", image);

      const uploadRes = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: imgData,
      });

      const uploadResult = await uploadRes.json();
      const imageUrl = uploadResult.imageUrl;

      await fetch("http://localhost:5000/api/stationery/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, price, image: imageUrl }),
      });

      setName("");
      setPrice("");
      setImage(null);
      loadItems();
      alert("Stationery item added!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  /* ---------------- TOGGLE / DELETE ---------------- */
  const toggleAvailability = async (id) => {
    await fetch(`http://localhost:5000/api/stationery/toggle/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadItems();
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await fetch(`http://localhost:5000/api/stationery/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadItems();
  };

  /* ---------------- LOAD ALL ORDERS ---------------- */
  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/orders/${id}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    loadOrders();
  };

  const statusOptions = ["Pending", "Accepted", "Completed"];

  /* ---------------- FILTERED ORDERS ---------------- */
  const filteredOrders = orders.filter((o) => o.orderType === orderType);

  return (
    <div className="vendor-xerox-page">
      {/* HERO */}
      <div className="vendor-hero-xerox">
        <h1>Vendor Xerox & Stationery 🖨️</h1>
        <p>Manage items & orders</p>
      </div>

      {/* MAIN TABS */}
      <div className="vendor-tabs-xerox">
        <button
          className={!showOrders ? "active" : ""}
          onClick={() => setShowOrders(false)}
        >
          Stationery
        </button>
        <button
          className={showOrders ? "active" : ""}
          onClick={() => {
            setShowOrders(true);
            loadOrders();
          }}
        >
          Orders
        </button>
      </div>

      {/* ---------------- STATIONERY ---------------- */}
      {!showOrders && (
        <>
          <div className="form-card">
            <h2>Add Stationery Item</h2>
            <form onSubmit={handleAddItem}>
              <input
                type="text"
                placeholder="Item name"
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
              <button className="primary-btn">Add Item</button>
            </form>
          </div>

          <div className="items-grid">
            {items.map((item) => (
              <div key={item._id} className="item-card">
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <p className={`availability ${item.available ? "on" : "off"}`}>
                  {item.available ? "Available" : "Unavailable"}
                </p>
                <button className="primary-btn" onClick={() => toggleAvailability(item._id)}>
                  Change Availability
                </button>
                <button className="danger-btn" onClick={() => deleteItem(item._id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------------- ORDERS ---------------- */}
      {showOrders && (
        <>
          {/* ORDER TYPE TABS */}
          <div className="vendor-sub-tabs">
            <button
              className={orderType === "STATIONERY" ? "active" : ""}
              onClick={() => setOrderType("STATIONERY")}
            >
              Stationery Orders
            </button>
            <button
              className={orderType === "XEROX" ? "active" : ""}
              onClick={() => setOrderType("XEROX")}
            >
              Xerox Orders
            </button>
          </div>

          <div className="orders-grid">
            {filteredOrders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              filteredOrders.map((o) => (
                <div key={o._id} className="order-card">
                  <p><strong>Order:</strong> {o._id.slice(-8)}</p>
                  <p><strong>User:</strong> {o.userId?.name || "User"}</p>
                  <p><strong>Phone:</strong> {o.phone}</p>
                  <p><strong>Address:</strong> {o.address}</p>

                  {/* STATIONERY */}
                  {o.orderType === "STATIONERY" && (
                    <div>
                      {o.items.map((it, idx) => (
                        <p key={idx}>{it.name} × {it.quantity || 1}</p>
                      ))}
                    </div>
                  )}

                  {/* XEROX */}
                  {o.orderType === "XEROX" && (
                    <>
                      <p>Pages: {o.pages}</p>
                      <p>Copies: {o.copies}</p>
                      <p>Color: {o.color ? "Color" : "B/W"}</p>
                      <p>Size: {o.pageSize}</p>

                      <a
                        href={`http://localhost:5000/${o.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-btn"
                      >
                        Download File
                      </a>
                    </>
                  )}

                  <p><strong>Amount:</strong> ₹{o.amount}</p>

                  <select
                    value={o.status}
                    onChange={(e) =>
                      updateStatus(o._id, e.target.value)
                    }
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VendorXerox;
