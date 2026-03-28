import React from "react";
import EventCard from "./EventCard";

export const events = [
  {
    id: 1,
    badge: "WEEKLY MEETUP",
    icon: "group",
    title: "The Buddy Circle",
    description:
      "A warm, no-pressure hangout for students and young people who find it hard to make friends in the city. Share stories, play light games, and build genuine connections at your own pace.",
    day: "Every Thursday",
    time: "5:00 PM",
    location: "CMC-Nepal, Thapathali, Kathmandu",
    link: "https://cmcnepal.org.np/"
  },
  {
    id: 2,
    badge: "ACADEMIC SUPPORT",
    icon: "menu_book",
    title: "Study Together Club",
    description:
      "Struggle with coursework or exam prep? Join peers who understand the pressure. We pair you with patient study partners and break tough subjects into manageable pieces — no judgement.",
    day: "Mon & Wed",
    time: "3:00 PM",
    location: "Kathmandu University Library, Hattiban Campus",
    link: "https://soed.ku.edu.np/scwc"
  },
  {
    id: 3,
    badge: "COUNSELING CIRCLE",
    icon: "favorite_border",
    title: "Safe Space Sessions",
    description:
      "Guided group sessions by trained counselors. Talk about loneliness, academic stress, or just listen. Everything shared here stays here.",
    day: "Every Friday",
    time: "4:30 PM",
    location: "School Counseling and Wellbeing Support Centre, KU Hattiban Campus",
    link: "https://soed.ku.edu.np/scwc"
  },
  {
    id: 4,
    badge: "SOCIAL EVENT",
    icon: "coffee",
    title: "Quiet Coffee Corner",
    description:
      "Not everyone thrives in loud crowds. Enjoy a calm café atmosphere with lo-fi music, affordable coffee, and friendly faces who understand introversion and city life. Regular informal meetups happen here.",
    day: "Every Saturday",
    time: "11:00 AM",
    location: "Himalayan Java, Jhamsikhel, Lalitpur",
    link: "https://himalayanjava.com/locations/jhamsikhel/"
  },
  {
    id: 5,
    badge: "WORKSHOP SERIES",
    icon: "psychology",
    title: "Mindful Focus Workshop",
    description:
      "Learn practical techniques for managing exam anxiety, improving concentration, and building a study routine — with guided meditation and discussion groups at Kopan Monastery.",
    day: "Bi-weekly Tuesday",
    time: "2:00 PM",
    location: "Kopan Monastery, Boudhanath, Kathmandu",
    link: "https://kopanmonastery.org/course-calendar/"
  },
  {
    id: 6,
    badge: "WELLNESS ACTIVITY",
    icon: "wb_sunny",
    title: "Morning Walk & Talk",
    description:
      "Start your day with a gentle walk alongside others in the fresh Kathmandu air. Movement eases anxiety, and a little morning sunlight goes a long way for your mood. Open to all.",
    day: "Weekdays",
    time: "7:30 AM",
    location: "Garden of Dreams, Thamel, Kathmandu",
    link: "https://ntb.gov.np/en/garden-of-dreams"
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
