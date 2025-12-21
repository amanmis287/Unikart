import React, { useEffect, useState } from "react";
import "../styles/Library.css";

const Library = () => {
  const [books, setBooks] = useState([]);
  const [rents, setRents] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);
  const [weeks, setWeeks] = useState(1);
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH BOOKS ================= */
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/library/books");
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
    loadBooks();
  }, []);

  /* ================= FETCH MY RENTS ================= */
  const fetchMyRents = async () => {
    if (!token) return alert("Login first");

    try {
      const res = await fetch("http://localhost:5000/api/library/my-rents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= TOTAL COST ================= */
  const totalCost = selectedBook ? selectedBook.pricePerWeek * weeks : 0;

  /* ================= RENT BOOK ================= */
  const handleRent = async () => {
    if (!token) return alert("Please login first");
    if (!phone.trim()) return alert("Enter phone number");

    try {
      setPaying(true);

      const res = await fetch("http://localhost:5000/api/orders/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalCost }),
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
        name: "UniKart Library",
        description: selectedBook.title,
        order_id: order.id,

        handler: async function (response) {
          try {
            await fetch("http://localhost:5000/api/library/rent", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                bookId: selectedBook._id,
                weeks,
                amount: totalCost,
                phone,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            alert("Book rented successfully!");
            setSelectedBook(null);
            setWeeks(1);
            setPhone("");
            if (showHistory) fetchMyRents();
          } catch (err) {
            console.error(err);
            alert("Payment done but rent save failed");
          } finally {
            setPaying(false);
          }
        },

        prefill: { contact: phone },
        theme: { color: "#ad8dee" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
      setPaying(false);
    }
  };

  return (
    <div className="library-container">
      {/* HERO */}
      <section className="library-hero">
        <h1>📚 UniKart Library</h1>
        <p>Rent books for up to 4 weeks</p>
      </section>

      {/* TABS */}
      <div className="library-tabs">
        <button
          className={!showHistory ? "active" : ""}
          onClick={() => setShowHistory(false)}
        >
          Books
        </button>
        <button
          className={showHistory ? "active" : ""}
          onClick={() => {
            setShowHistory(true);
            fetchMyRents();
          }}
        >
          My Rents
        </button>
      </div>

      {/* BOOKS TAB */}
      {!showHistory && (
        <section className="book-section">
          <div className="book-grid">
            {books.map((book) => (
              <div key={book._id} className="book-card">
                <img src={book.image} alt={book.title} />
                <h3>{book.title}</h3>
                <p className="author">By {book.author}</p>
                <p className="rent">₹{book.pricePerWeek} / week</p>

                <p className={`availability ${book.available ? "on" : "off"}`}>
                  {book.available ? "Available" : "Unavailable"}
                </p>

                <button
                  className="rent-btn"
                  disabled={!book.available}
                  onClick={() => setSelectedBook(book)}
                >
                  Rent Book
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RENT HISTORY TAB */}
      {/* RENT HISTORY TAB */}
      {showHistory && (
        <section className="history-section">
          <h2>My Rented Books</h2>

          {rents.length === 0 ? (
            <p>No rentals yet</p>
          ) : (
            <div className="rent-table">
              {rents.map((r) => (
                <div key={r._id} className="rent-row">
                  {/* LEFT */}
                  <div className="rent-main">
                    <h4>{r.bookId.title}</h4>
                    <p className="author">by {r.bookId.author}</p>
                    <p className="meta">
                      Weeks: {r.weeks} • Amount: ₹{r.amount}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="rent-side">
                    <span className={`status ${r.status}`}>{r.status}</span>
                    <p className="request-id">Request ID: {r._id.slice(-8)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* RENT POPUP */}
      {selectedBook && (
        <div className="popup-overlay" onClick={() => setSelectedBook(null)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedBook.title}</h2>

            <label>Weeks (1–4)</label>
            <select
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((w) => (
                <option key={w} value={w}>
                  {w} week{w > 1 && "s"}
                </option>
              ))}
            </select>

            <input
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <h3>Total: ₹{totalCost}</h3>

            <button className="pay-rent-btn" onClick={handleRent} disabled={paying}>
              {paying ? "Processing..." : `Pay ₹${totalCost}`}
            </button>

            <button className="close-btn" onClick={() => setSelectedBook(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
