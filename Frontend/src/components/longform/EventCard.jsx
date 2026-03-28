import React, { useState } from "react";

export const cardStyles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    border: "1px solid #efefef",
    transition: "box-shadow 0.2s ease",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    color: "#555",
    backgroundColor: "#f5f5f5",
    border: "1px solid #e0e0e0",
    borderRadius: "20px",
    padding: "4px 10px",
    width: "fit-content",
  },
  iconBox: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#444",
    fontSize: "18px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0",
    fontFamily: "'Georgia', serif",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.6",
    margin: "0",
  },
  meta: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#555",
  },
  metaIcon: {
    fontSize: "15px",
    color: "#777",
  },
  divider: {
    height: "1px",
    backgroundColor: "#efefef",
    margin: "16px 0",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    width: "100%",
    marginTop: "auto",
    paddingTop: "20px",
  },
  viewBtn: {
    backgroundColor: "#1a3a1a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 22px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.01em",
    transition: "background 0.15s",
  },
  joinBtn: {
    background: "none",
    border: "none",
    color: "#1a3a1a",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "0",
  },
};

export default function EventCard({ event }) {
  const [hovered, setHovered] = useState(false);

  const handleJoin = (e) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm(`Do you want to join "${event.title}"?`);
    if (confirmed) {
      window.alert(`You're in! See you at "${event.title}".`);
    }
  };

  const handleCardClick = () => {
    const confirmed = window.confirm(`Do you want to join "${event.title}"?`);
    if (confirmed) {
      window.alert(`You're in! See you at "${event.title}".`);
    }
  };

  return (
    <div
      style={{
        ...cardStyles.card,
        boxShadow: hovered
          ? "0 4px 16px rgba(0,0,0,0.13)"
          : "0 1px 4px rgba(0,0,0,0.08)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
    >
      {/* Top row: icon + badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div style={cardStyles.iconBox}>
          <span className="material-icons" style={{ fontSize: "18px" }}>
            {event.icon}
          </span>
        </div>
        <div style={cardStyles.badge}>{event.badge}</div>
      </div>

      {/* Title */}
      <h3 style={{ ...cardStyles.title, marginBottom: "10px" }}>
        {event.title}
      </h3>

      {/* Description */}
      <p style={{ ...cardStyles.description, marginBottom: "18px" }}>
        {event.description}
      </p>

      {/* Divider */}
      <div style={cardStyles.divider} />

      {/* Meta */}
      <div style={cardStyles.meta}>
        <div style={cardStyles.metaRow}>
          <span className="material-icons" style={cardStyles.metaIcon}>
            calendar_today
          </span>
          <span>{event.day}</span>
        </div>
        <div style={cardStyles.metaRow}>
          <span className="material-icons" style={cardStyles.metaIcon}>
            schedule
          </span>
          <span>{event.time}</span>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            event.location
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={cardStyles.metaRow}>
            <span className="material-icons" style={cardStyles.metaIcon}>
              location_on
            </span>
            <span style={{ textDecoration: "underline" }}>{event.location}</span>
          </div>
        </a>
      </div>

      {/* Divider */}
      <div style={cardStyles.divider} />

      {/* Actions */}
      <div style={cardStyles.actions}>
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", display: "block", flex: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            style={{ ...cardStyles.viewBtn, width: "100%" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2d5a2d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#1a3a1a")
            }
          >
            View Details
          </button>
        </a>
        <button style={{ ...cardStyles.joinBtn, width: "100%", flex: 1, textAlign: "center" }} onClick={handleJoin}>Join</button>
      </div>
    </div>
  );
}
