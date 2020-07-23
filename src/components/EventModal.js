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
        size="lg"
        show={props.show}
        onHide={props.handleClose}
      >
        <Modal.Body>
          <EventForm
            lat={props.lat}
            lng={props.lng}
            form={props.form}
            show={props.show}
            handleClose={props.handleClose}
            setCoordinates={props.setCoordinates}
            streetAddress={props.streetAddress}
            day={props.day}
            user={props.user}
            apiDate={props.apiDate}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
