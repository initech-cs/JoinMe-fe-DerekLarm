import React from "react";
import { Event, Map, EventModal } from "../components/index";

export default function Home(props) {
  return (
    <div>
      <Map show={props.show} handleClose={props.handleClose} handleShow={props.handleShow} />
      <EventModal />
      <Event />
    </div>
  );
}
