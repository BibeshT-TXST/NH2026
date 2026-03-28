import React from "react";
import EventCard from "./EventCard";

export const events = [
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



export default function CampusEventsGrid() {
  return (
    <>
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
