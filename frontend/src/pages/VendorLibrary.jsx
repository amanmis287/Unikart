import React, { useEffect, useState, useCallback } from "react";
import "../styles/VendorLibrary.css";

const VendorLibrary = () => {
  /* ================= STATE ================= */
  const [books, setBooks] = useState([]);
  const [rents, setRents] = useState([]);
  const [showRents, setShowRents] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pricePerWeek, setPricePerWeek] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= LOAD BOOKS ================= */
  const loadBooks = useCallback(async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/library/vendor/books",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load books", err);
    }
  }, [token]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  /* ================= LOAD RENT REQUESTS ================= */
  const loadRents = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/library/vendor/rents",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setRents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load rents", err);
    }
  };

  /* ================= ADD BOOK ================= */
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select book image");

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

      await fetch("http://localhost:5000/api/library/vendor/add-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          author,
          pricePerWeek,
          image: imageUrl,
        }),
      });

      setTitle("");
      setAuthor("");
      setPricePerWeek("");
      setImage(null);

      loadBooks();
      alert("Book added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add book");
    }
  };

  /* ================= TOGGLE AVAILABILITY ================= */
  const toggleAvailability = async (id) => {
    await fetch(
      `http://localhost:5000/api/library/vendor/toggle/${id}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    loadBooks();
  };

  /* ================= DELETE BOOK ================= */
  const deleteBook = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    await fetch(
      `http://localhost:5000/api/library/vendor/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    loadBooks();
  };

  /* ================= UPDATE RENT STATUS ================= */
  const updateRentStatus = async (id, status) => {
    await fetch(
      `http://localhost:5000/api/library/vendor/rent/${id}/status`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );
    loadRents();
  };

  return (
    <div className="vendor-library-page">
      {/* HERO */}
      <div className="vendor-library-hero">
        <h1>Library Management 📚</h1>
        <p>Manage books & rent requests</p>
      </div>

      {/* TABS */}
      <div className="vendor-library-tabs">
        <button
          className={!showRents ? "active" : ""}
          onClick={() => setShowRents(false)}
        >
          Books
        </button>
        <button
          className={showRents ? "active" : ""}
          onClick={() => {
            setShowRents(true);
            loadRents();
          }}
        >
          Rent Requests
        </button>
      </div>

      {/* ================= BOOKS TAB ================= */}
      {!showRents && (
        <>
          <div className="library-form-card">
            <h2>Add New Book</h2>
            <form onSubmit={handleAddBook}>
              <input
                type="text"
                placeholder="Book Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Price per week (₹)"
                value={pricePerWeek}
                onChange={(e) => setPricePerWeek(e.target.value)}
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />

              <button className="library-primary-btn">
                Add Book
              </button>
            </form>
          </div>

          <div className="library-books-grid">
            {books.length === 0 ? (
              <p>No books added yet</p>
            ) : (
              books.map((book) => (
                <div key={book._id} className="library-book-card">
                  <img src={book.image} alt={book.title} />
                  <h3>{book.title}</h3>
                  <p className="author">{book.author}</p>
                  <p className="price">₹{book.pricePerWeek} / week</p>

                  <p
                    className={`availability ${
                      book.available ? "on" : "off"
                    }`}
                  >
                    {book.available ? "Available" : "Unavailable"}
                  </p>

                  <button
                    className="library-primary-btn"
                    onClick={() => toggleAvailability(book._id)}
                  >
                    Change Availability
                  </button>

                  <button
                    className="library-danger-btn"
                    onClick={() => deleteBook(book._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ================= RENT REQUESTS TAB ================= */}
      {showRents && (
        <div className="rent-requests">
          {rents.length === 0 ? (
            <p>No rent requests</p>
          ) : (
            rents.map((r) => (
              <div key={r._id} className="rent-row">
                <div className="rent-main">
                  <h4>{r.bookId.title}</h4>
                  <p className="author">by {r.bookId.author}</p>
                  <p className="meta">
                    Weeks: {r.weeks} • Amount: ₹{r.amount}
                  </p>
                  <p className="meta">
                    User: {r.userId?.name || "User"} • Phone: {r.phone}
                  </p>
                  <p className="request-id">
                    Request ID: {r._id.slice(-8)}
                  </p>
                </div>

                <div className="rent-side">
                  <select
                    value={r.status}
                    onChange={(e) =>
                      updateRentStatus(r._id, e.target.value)
                    }
                  >
                    <option value="REQUESTED">REQUESTED</option>
                    <option value="AVAILED">AVAILED</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VendorLibrary;
