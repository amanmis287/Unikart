import React, { useState } from "react";
import "../styles/AddNote.css";

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !desc || !file) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("file", file);
    formData.append("isPaid", isPaid);
    formData.append("price", isPaid ? price : 0);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      alert("Note uploaded successfully ✅");

      // reset form
      setTitle("");
      setDesc("");
      setFile(null);
      setIsPaid(false);
      setPrice("");
    } catch (err) {
      console.error(err);
      alert("Error uploading note ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addnotes-container">
      <section className="addnotes-hero">
        <h1>Upload Notes</h1>
        <p>Help others by sharing your notes</p>
      </section>

      <form className="addnote-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />

        <label>Upload File</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <label>Note Type</label>
        <select
          value={isPaid ? "PAID" : "FREE"}
          onChange={(e) => setIsPaid(e.target.value === "PAID")}
        >
          <option value="FREE">Free</option>
          <option value="PAID">Paid</option>
        </select>

        {isPaid && (
          <>
            <label>Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Note"}
        </button>
      </form>
    </div>
  );
};

export default AddNote;
