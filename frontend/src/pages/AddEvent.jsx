import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddEvent.css";

const AddEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* AUTH CHECK */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can upload maximum 5 images");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Title and description are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (eventDate) {
      formData.append("eventDate", eventDate);
    }

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to post event");
      }

      alert("Event posted successfully 🎉");

      // reset form
      setTitle("");
      setDescription("");
      setEventDate("");
      setImages([]);

      navigate("/"); // go back to home after posting
    } catch (err) {
      alert("Error posting event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-event-container">
      <section className="add-event-hero">
        <h1>Add New Event</h1>
        <p>Post upcoming college events like placements or fests</p>
      </section>

      <form className="add-event-form" onSubmit={handleSubmit}>
        <label>Event Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Eg: Placement Drive – TCS"
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event details, venue, eligibility, etc."
        />

        <label>Event Date (optional)</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />

        <label>Upload Images (max 5)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Event"}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
