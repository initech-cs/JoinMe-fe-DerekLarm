import React from "react";
import { Modal } from "react-bootstrap";
import { EventForm } from "./index";

export default function EventModal(props) {
  return (
    <div>
      <Modal
        style={{
          overlay: { zIndex: 1000 },
        }}
        show={props.show}
        onHide={props.handleClose}
      >
        <Modal.Header>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* FORM */}
          <EventForm
            lat={props.lat}
            lng={props.lng}
            form={props.form}
            show={props.show}
            handleClose={props.handleClose}
            setCoordinates={props.setCoordinates}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
