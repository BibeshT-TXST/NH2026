import React, { useState } from "react";

const events = [
  {
    id: 1,
    badge: "WEEKLY MEETUP",
    icon: "group",
    title: "The Buddy Circle",
    description:
      "A warm, no-pressure hangout for students who find it hard to make friends. Share stories, play games, and build genuine connections at your own pace.",
    day: "Every Thursday",
    time: "5:00 PM",
    location: "Student Wellness Center, Room 204",
  },
  {
    id: 2,
    badge: "ACADEMIC SUPPORT",
    icon: "menu_book",
    title: "Study Together Club",
    description:
      "Struggle with coursework? Join peers who get it. We pair you with patient study partners and break tough subjects into bite-sized pieces — no judgement.",
    day: "Mon & Wed",
    time: "3:00 PM",
    location: "Library Commons, 2nd Floor",
  },
  {
    id: 3,
    badge: "COUNSELING CIRCLE",
    icon: "favorite_border",
    title: "Safe Space Sessions",
    description:
      "Guided group sessions led by a trained counselor. Talk about loneliness, academic stress, or just listen. Everything shared here stays here.",
    day: "Every Friday",
    time: "4:30 PM",
    location: "Counseling Wing, Building C",
  },
  {
    id: 4,
    badge: "SOCIAL EVENT",
    icon: "coffee",
    title: "Quiet Coffee Corner",
    description:
      "Not everyone thrives in loud crowds. Enjoy a calm café atmosphere with lo-fi music, free coffee, and friendly faces who understand introversion.",
    day: "Every Saturday",
    time: "11:00 AM",
    location: "Campus Café Lounge",
  },
  {
    id: 5,
    badge: "WORKSHOP SERIES",
    icon: "psychology",
    title: "Mindful Focus Workshop",
    description:
      "Learn practical techniques for managing exam anxiety, improving concentration, and building a study routine that actually works for your brain.",
    day: "Bi-weekly Tuesday",
    time: "2:00 PM",
    location: "Mindfulness Lab, Wellness Block",
  },
  {
    id: 6,
    badge: "WELLNESS ACTIVITY",
    icon: "wb_sunny",
    title: "Morning Walk & Talk",
    description:
      "Start your day with a gentle campus walk alongside others. Movement eases anxiety, and a little sunlight goes a long way for your mood.",
    day: "Weekdays",
    time: "7:30 AM",
    location: "Main Campus Gate",
  },
];

const cardStyles = {
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

function EventCard({ event }) {
  const [hovered, setHovered] = useState(false);

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
        <div style={cardStyles.metaRow}>
          <span className="material-icons" style={cardStyles.metaIcon}>
            location_on
          </span>
          <span>{event.location}</span>
        </div>
      </div>

      {/* Divider */}
      <div style={cardStyles.divider} />

      {/* Actions */}
      <div style={cardStyles.actions}>
        <button
          style={cardStyles.viewBtn}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#2d5a2d")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#1a3a1a")
          }
        >
          View Details
        </button>
        <button style={cardStyles.joinBtn}>Join</button>
      </div>
    </div>
  );
}

export default function CampusEventsGrid() {
  return (
    <>
      {/* Material Icons CDN */}
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Georgia&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          backgroundColor: "#f4f4f4",
          minHeight: "100vh",
          padding: "40px 32px",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            maxWidth: "960px",
            margin: "0 auto",
          }}
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </>
  );
}
