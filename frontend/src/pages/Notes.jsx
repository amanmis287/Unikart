import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const token = localStorage.getItem("token");

  /* FETCH NOTES */
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/notes`)
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error(err));
  }, []);

  /* DOWNLOAD NOTE */
  const downloadNote = async (noteId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/notes/download/${noteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Not authorized");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "note";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("You must be logged in / paid to download");
    }
  };

  /* BUY PAID NOTE */
  const buyNote = async (note) => {
    try {
      // 1️⃣ Create Razorpay order
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/notes/payment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: note.price }),
        }
      );

      const order = await res.json();

      // 2️⃣ Open Razorpay
      const options = {
        key: "rzp_test_RjDRhVwDPmTpbQ",
        amount: order.amount,
        currency: "INR",
        name: "UniKart Notes",
        description: note.title,
        handler: async function (response) {
          // 3️⃣ Verify payment
          await fetch(`${process.env.REACT_APP_API_URL}/api/notes/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              noteId: note._id,
              paymentId: response.razorpay_payment_id,
            }),
          });

          alert("Payment successful ✅");
          downloadNote(note._id);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment failed ❌");
    }
  };

  return (
    <div className="notes-page">
      {/* HERO */}
      <section className="notes-hero">
        <h1>📘 UniKart Notes</h1>
        <p>Upload and access handwritten notes, PDFs, study guides and more.</p>
      </section>

      {/* NOTES LIST */}
      <section className="notes-list-section">
        <h2>Available Notes</h2>

        <div className="notes-cards-container">
          {notes.map((note) => (
            <div className="notes-card" key={note._id}>
              <div className="note-header">
                <h3>{note.title}</h3>
                <span className={note.isPaid ? "paid-badge" : "free-badge"}>
                  {note.isPaid ? `₹${note.price}` : "FREE"}
                </span>
              </div>

              <p className="description">{note.description}</p>

              <p className="uploaded-by">
                Uploaded by <strong>{note.uploadedBy?.name}</strong>
              </p>

              {note.isPaid ? (
                <button className="buy-btn" onClick={() => buyNote(note)}>
                  Buy & Download
                </button>
              ) : (
                <button
                  className="download-notes-btn"
                  onClick={() => downloadNote(note._id)}
                >
                  Download
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ADD NOTE BUTTON */}
      <Link to="/add-note">
        <button className="add-note-btn">+</button>
      </Link>
    </div>
  );
};

export default Notes;
