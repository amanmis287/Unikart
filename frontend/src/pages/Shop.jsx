import React, { useEffect, useState } from "react";
import "../styles/Shop.css";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paying, setPaying] = useState(false);

  const token = localStorage.getItem("token");

  /* ---------------- FETCH STATIONERY ---------------- */
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stationery");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch stationery:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  /* ---------------- FETCH MY STATIONERY ORDERS ---------------- */
  const fetchMyOrders = async () => {
    if (!token) {
      alert("Please login to view orders");
      return;
    }

    try {
      setLoadingOrders(true);

      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // ONLY STATIONERY ORDERS
      const stationeryOrders = Array.isArray(data)
        ? data.filter((o) => o.orderType === "STATIONERY")
        : [];

      setOrders(stationeryOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  /* ---------------- PAYMENT ---------------- */
  const startPayment = async () => {
    if (!token) return alert("Please login first");
    if (!phone.trim() || !address.trim())
      return alert("Please enter phone and address");
    if (!selectedItem) return;

    try {
      setPaying(true);

      const res = await fetch("http://localhost:5000/api/orders/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedItem.price }),
      });

      const order = await res.json();
      if (!order?.id) {
        alert("Payment init failed");
        setPaying(false);
        return;
      }

      const options = {
        key: "rzp_test_RjDRhVwDPmTpbQ",
        amount: order.amount,
        currency: "INR",
        name: "UniKart Stationery",
        description: selectedItem.name,
        order_id: order.id,

        handler: async function (response) {
          try {
            await fetch("http://localhost:5000/api/orders/save", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                orderType: "STATIONERY",
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
            });

            alert("Stationery order placed successfully!");
            setSelectedItem(null);
            setPhone("");
            setAddress("");
            if (showOrders) fetchMyOrders();
          } catch (err) {
            console.error(err);
            alert("Payment done but order save failed");
          } finally {
            setPaying(false);
          }
        },

        theme: { color: "#059669" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed");
      setPaying(false);
    }
  };

  return (
    <div className="shop-page">
      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <h1>Stationery & Xerox</h1>
        <p>All your stationery items and xerox services in one place.</p>

        <button className="xerox-btn" onClick={() => navigate("/xerox")}>
          Get Xerox
        </button>
      </section>

      {/* ---------------- TABS ---------------- */}
      <div className="shop-tabs">
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
            fetchMyOrders();
          }}
        >
          My Orders
        </button>
      </div>

      {/* ---------------- STATIONERY ---------------- */}
      {!showOrders && (
        <section className="items-container">
          <h2>Stationery Items</h2>

          {loading ? (
            <p>Loading items...</p>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div
                  key={item._id}
                  className={`item-card ${
                    !item.available ? "out-of-stock" : ""
                  }`}
                >
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>

                  <p className={`stock ${item.available ? "in" : "out"}`}>
                    {item.available ? "Available" : "Out of Stock"}
                  </p>

                  <button
                    className="add-btn"
                    disabled={!item.available}
                    onClick={() => setSelectedItem(item)}
                  >
                    {item.available ? "Order Now" : "Unavailable"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ---------------- MY ORDERS ---------------- */}
      {showOrders && (
        <section className="history-section">
          <h2>My Stationery Orders 📦</h2>

          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No stationery orders yet.</p>
          ) : (
            <div className="history-list">
              {orders.map((o) => (
                <div key={o._id} className="history-card">
                  <p>
                    <strong>Order:</strong> {o._id.slice(-8)}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${o.status}`}>{o.status}</span>
                  </p>

                  <div className="history-items">
                    {o.items.map((it, idx) => (
                      <p key={idx}>
                        {it.name} x{it.quantity} • ₹{it.price}
                      </p>
                    ))}
                  </div>

                  <p className="history-total">Total: ₹{o.amount}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ---------------- ORDER POPUP ---------------- */}
      {selectedItem && (
        <div className="popup-overlay" onClick={() => setSelectedItem(null)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedItem.name}</h2>
            <p>₹{selectedItem.price}</p>

            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <textarea
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button
              className="pay-shop-btn"
              onClick={startPayment}
              disabled={paying}
            >
              {paying ? "Processing..." : `Pay ₹${selectedItem.price}`}
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

export default Shop;
