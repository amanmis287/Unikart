import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  /* FETCH EVENTS */
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="home-container">
      {/* HERO */}
      <section className="hero-section">
        <h1>Welcome to UniKart</h1>
        <p>Your one-stop campus marketplace — from Xerox to Café delivery!</p>
      </section>

      {/* SERVICES */}
      <section className="services">
        <div className="service-card xerox">
          <h2>📄 Xerox & Stationery</h2>
          <p>Order notes, printouts, and essential stationery items.</p>
          <button onClick={() => navigate("/shop")}>Order Now</button>
        </div>

        <div className="service-card cafe">
          <h2>☕ Café Orders</h2>
          <p>Order snacks or coffee from the campus café.</p>
          <button onClick={() => navigate("/cafe")}>Order Now</button>
        </div>

        <div className="service-card library">
          <h2>📚 Library Rentals</h2>
          <p>Rent or buy academic books online.</p>
          <button onClick={() => navigate("/library")}>Explore</button>
        </div>

        <div className="service-card notes">
          <h2>📝 Notes Marketplace</h2>
          <p>Buy, sell, or share notes among students.</p>
          <button onClick={() => navigate("/notes")}>Visit</button>
        </div>
      </section>

      {/* EVENTS */}
      <section className="events-section">
        <h2>📢 College Events</h2>

        {events.length === 0 ? (
          <p className="no-events">No upcoming events</p>
        ) : (
          <div className="events-container">
            {events.map((event) => (
              <div className="event-card" key={event._id}>
                <h3>{event.title}</h3>

                {event.eventDate && (
                  <p className="event-date">
                    📅 {new Date(event.eventDate).toDateString()}
                  </p>
                )}

                <p className="event-desc">{event.description}</p>

                {/* IMAGES */}
                <div className="event-images">
                  {event.images.map((img, index) => (
                    <img src={img} alt="event" key={index} />
                  ))}
                </div>

                <p className="posted-by">
                  Posted by <strong>{event.postedBy?.name}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ADD EVENT BUTTON */}
      <Link to="/add-event">
        <button className="add-event-btn">+</button>
      </Link>
    </div>
  );
}

export default Home;
