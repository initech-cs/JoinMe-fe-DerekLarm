import React, { useState, useEffect } from "react";

export default function Event(props) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/event`);
      const events = await data.json();
      setEvents(events);
    }
    fetchData();
  }, []);

  return (
    <div>
      {events.map((e) => (
        <EventList {...e} />
      ))}
    </div>
  );
}

const EventList = ({ title, description }) => (
  <div>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);
