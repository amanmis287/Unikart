import React, { useState } from "react";
import "../styles/Xerox.css";

const Xerox = () => {
  const [file, setFile] = useState(null);
  const [colorMode, setColorMode] = useState("bw");
  const [pageSize, setPageSize] = useState("A4");
  const [pages, setPages] = useState(1);
  const [copies, setCopies] = useState(1);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [paying, setPaying] = useState(false);

  const token = localStorage.getItem("token");

  /* ---------------- XEROX COST ---------------- */
  const totalCost = () => {
    const base = colorMode === "color" ? 5 : 2;
    const multiplier = pageSize === "A3" ? 2 : 1;
    return base * multiplier * pages * copies;
  };

  /* ---------------- FETCH MY XEROX ORDERS ---------------- */
  const fetchMyOrders = async () => {
    if (!token) return alert("Login first");

    const res = await fetch("http://localhost:5000/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    const xeroxOrders = Array.isArray(data)
      ? data.filter((o) => o.orderType === "XEROX")
      : [];

    setOrders(xeroxOrders);
  };

  /* ---------------- PLACE XEROX ORDER (WITH PAYMENT) ---------------- */
  const handleXeroxOrder = async () => {
    if (!file || !phone || !address) {
      alert("Fill all details");
      return;
    }

    if (!token) {
      alert("Please login again");
      return;
    }

    try {
      setPaying(true);

      /* CREATE RAZORPAY ORDER */
      const res = await fetch("http://localhost:5000/api/orders/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalCost() }),
      });

      const order = await res.json();
      if (!order?.id) {
        alert("Payment init failed");
        setPaying(false);
        return;
      }

      /* OPEN RAZORPAY */
      const options = {
        key: "rzp_test_RjDRhVwDPmTpbQ",
        amount: order.amount,
        currency: "INR",
        name: "UniKart Xerox",
        description: "Xerox & Printing",
        order_id: order.id,

        handler: async function (response) {
          try {
            /* SAVE XEROX ORDER WITH PAYMENT DETAILS */
            const formData = new FormData();
            formData.append("file", file);
            formData.append("pages", pages);
            formData.append("copies", copies);
            formData.append("color", colorMode === "color");
            formData.append("pageSize", pageSize);
            formData.append("amount", totalCost());
            formData.append("phone", phone);
            formData.append("address", address);

            // PAYMENT DATA (THIS FIXES paymentStatus)
            formData.append("razorpayOrderId", response.razorpay_order_id);
            formData.append("razorpayPaymentId", response.razorpay_payment_id);
            formData.append("razorpaySignature", response.razorpay_signature);

            await fetch("http://localhost:5000/api/xerox", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });

            alert("Payment successful & Xerox order placed!");

            setFile(null);
            setPages(1);
            setCopies(1);
            setPhone("");
            setAddress("");

            if (showOrders) fetchMyOrders();
          } catch (err) {
            console.error(err);
            alert("Payment done but Xerox order save failed");
          } finally {
            setPaying(false);
          }
        },

        prefill: {
          contact: phone,
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
    <div className="xerox-page">
      {/* ---------------- TABS ---------------- */}
      <div className="xerox-tabs">
        <button
          className={`xerox-tab-btn ${!showOrders ? "active" : ""}`}
          onClick={() => setShowOrders(false)}
        >
          Xerox
        </button>
        <button
          className={`xerox-tab-btn ${showOrders ? "active" : ""}`}
          onClick={() => {
            setShowOrders(true);
            fetchMyOrders();
          }}
        >
          My Orders
        </button>
      </div>

      {/* ---------------- XEROX FORM ---------------- */}
      {!showOrders && (
        <div className="form-card">
          <h2>Xerox & Printing</h2>

          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value)}
          >
            <option value="bw">Black & White</option>
            <option value="color">Color</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          >
            <option value="A4">A4</option>
            <option value="A3">A3</option>
          </select>

          <input
            type="number"
            min="1"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder="Pages"
          />

          <input
            type="number"
            min="1"
            value={copies}
            onChange={(e) => setCopies(e.target.value)}
            placeholder="Copies"
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <h3>Total: ₹{totalCost()}</h3>

          <button
            className="submit-btn"
            onClick={handleXeroxOrder}
            disabled={paying}
          >
            {paying ? "Processing..." : `Pay ₹${totalCost()}`}
          </button>
        </div>
      )}

      {/* ---------------- ORDER HISTORY ---------------- */}
      {showOrders && (
        <div className="history-section">
          <h2>My Xerox Orders</h2>

          {orders.length === 0 ? (
            <p>No xerox orders found</p>
          ) : (
            orders.map((o) => (
              <div key={o._id} className="history-card">
                <p>
                  <strong>Order:</strong> {o._id.slice(-8)}
                </p>
                <div className="xerox-meta">
                  <p>Pages: {o.pages}</p>
                  <p>Copies: {o.copies}</p>
                  <p>Color: {o.color ? "Color" : "B/W"}</p>
                  <p>Size: {o.pageSize}</p>
                </div>
                <p className="xerox-amount">Total: ₹{o.amount}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-badge ${o.status}`}>{o.status}</span>
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Xerox;
