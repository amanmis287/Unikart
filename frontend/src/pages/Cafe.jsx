import React, { useEffect, useState } from "react";
import "../styles/Cafe.css";

const Cafe = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const [showHistory, setShowHistory] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cafe");
        const data = await res.json();
        setMenuItems(data || []);
      } catch (error) {
        console.error("Error fetching café items:", error);
      }
    };

    fetchItems();
  }, []);

  const fetchOrderHistory = async () => {
    if (!token) {
      alert("Please login to view your orders.");
      return;
    }

    try {
      setLoadingOrders(true);
      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        setOrders([]);
        setLoadingOrders(false);
        return;
      }

      const data = await res.json();
      // FILTER ONLY CAFE ORDERS
      const cafeOrders = Array.isArray(data)
        ? data.filter((o) => o.orderType === "CAFE")
        : [];

      setOrders(cafeOrders);
      setLoadingOrders(false);
    } catch (err) {
      console.error("Order history error:", err);
      setOrders([]);
      setLoadingOrders(false);
    }
  };

  const openHistory = () => {
    setShowHistory(true);
    setTimeout(fetchOrderHistory, 50);
  };

  const openOrderPopup = (item) => {
    setSelectedItem(item);
  };

  const startPayment = async () => {
    if (!phone || !address) {
      alert("Please enter phone and address.");
      return;
    }

    if (!selectedItem) {
      alert("No item selected.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/orders/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedItem.price }),
      });

      const order = await res.json();
      if (!order || !order.id) {
        alert("Failed to create Razorpay order");
        return;
      }

      const options = {
        key: "rzp_test_RjDRhVwDPmTpbQ",
        amount: order.amount,
        currency: "INR",
        name: "UniKart Café",
        description: `Payment for ${selectedItem.name}`,
        order_id: order.id,

        handler: async function (response) {
          try {
            const saveRes = await fetch(
              "http://localhost:5000/api/orders/save",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  items: [
                    {
                      itemId: selectedItem._id,
                      name: selectedItem.name,
                      price: selectedItem.price,
                      quantity: 1,
                    },
                  ],
                  amount: selectedItem.price,
                  phone,
                  address,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              }
            );

            if (!saveRes.ok) {
              alert("Payment succeeded but saving order failed.");
            } else {
              alert("Order Saved Successfully!");
              if (showHistory) fetchOrderHistory();
            }
          } catch (err) {
            console.error("Error saving order:", err);
            alert("There was an error saving your order.");
          } finally {
            setSelectedItem(null);
            setPhone("");
            setAddress("");
          }
        },

        prefill: {
          name: localStorage.getItem("userName") || "User",
          email: "test@example.com",
          contact: phone || "9999999999",
        },

        theme: { color: "#f59e0b" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed.");
    }
  };

  const statusColor = {
    Pending: "#f59e0b",
    Accepted: "#2563eb",
    Preparing: "#fb923c",
    Completed: "#16a34a",
    Canceled: "#ef4444",
  };

  return (
    <div className="cafe-container">
      <div className="cafe-tabs">
        <button
          className={`tab-btn ${!showHistory ? "active" : ""}`}
          onClick={() => setShowHistory(false)}
        >
          Menu
        </button>

        <button
          className={`tab-btn ${showHistory ? "active" : ""}`}
          onClick={openHistory}
        >
          My Orders
        </button>
      </div>

      {/* ---------------- MENU PAGE ---------------- */}
      {!showHistory && (
        <>
          <section className="cafe-hero">
            <div className="hero-content">
              <h1>Welcome to UniKart Café ☕</h1>
              <p>Enjoy delicious snacks and beverages on campus.</p>
            </div>
          </section>

          <section className="menu-section">
            <h2>Our Menu</h2>

            <div className="menu-grid">
              {menuItems.map((item) => (
                <div key={item._id} className="menu-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="menu-image"
                  />

                  <h3>{item.name}</h3>
                  <p className="price">₹{item.price}</p>

                  <p
                    className="availability"
                    style={{ color: item.available ? "#16a34a" : "#ef4444" }}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </p>

                  <button
                    className="order-btn"
                    onClick={() => openOrderPopup(item)}
                    disabled={!item.available}
                  >
                    {item.available ? "Order Now" : "Unavailable"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ---------------- ORDER HISTORY ---------------- */}
      {showHistory && (
        <section className="history-section">
          <h2>My Orders 📦</h2>

          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="history-list">
              {orders.map((o) => (
                <div className="history-card" key={o._id}>
                  <div className="history-top">
                    <div>
                      <p className="order-id">Order: {o._id.slice(-8)}</p>
                      <p className="order-date">
                        {new Date(o.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div
                      className="status-badge"
                      style={{
                        backgroundColor: statusColor[o.status] || "#9ca3af",
                      }}
                    >
                      {o.status}
                    </div>
                  </div>

                  <div className="history-items">
                    {o.items.map((it, idx) => (
                      <div className="item-row" key={idx}>
                        <span className="item-name">{it.name}</span>
                        <span className="item-meta">
                          x{it.quantity || 1} • ₹{it.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="history-footer">
                    <div className="total-amount">
                      Total: <strong>₹{o.amount}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ---------------- POPUP ---------------- */}
      {selectedItem && (
        <div className="popup-overlay" onClick={() => setSelectedItem(null)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="popup-title">Order: {selectedItem.name}</h2>
            <p className="popup-price">Amount: ₹{selectedItem.price}</p>

            <div className="popup-input-group">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="popup-input-group">
              <label>Delivery Address</label>
              <textarea
                placeholder="Enter delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>

            <button onClick={startPayment} className="pay-btn">
              Pay ₹{selectedItem.price}
            </button>

            <button className="close-btn" onClick={() => setSelectedItem(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cafe;
