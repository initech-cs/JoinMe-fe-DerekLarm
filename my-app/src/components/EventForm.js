import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Rheostat from "rheostat";

export default function EventForm(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxGroupSize, setMaxGroupSize] = useState("");
  // RHEOSTAT INPUT
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(24);
  const [tempStartTime, setTempStartTime] = useState(0);
  const [tempEndTime, setTempEndTime] = useState(24);

  const createEvent = async (e) => {
    const lat = props.lat;
    const lng = props.lng;
    e.preventDefault();
    const eventData = {
      title,
      description,
      startTime,
      endTime,
      maxGroupSize,
      lat,
      lng,
      time: new Date(),
    };
    // eslint-disable-next-line
    const newEvent = await fetch("http://localhost:5000/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    const data = await fetch("http://localhost:5000/event");
    const resp = await data.json();
    props.setCoordinates(resp);
    console.log("resp", resp);
    props.handleClose();
  };

  const cancelFunc = () => {
    props.handleClose();
  };

  const handleChange = (e) => {
    setStartTime(e.values[0]);
    setEndTime(e.values[1]);
  };
  const handleValuesUpdated = (e) => {
    setTempStartTime(e.values[0]);
    setTempEndTime(e.values[1]);
  };

  return (
    <div>
      <Form onSubmit={createEvent}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="startEndTime">
          <Form.Label>Start/End Time</Form.Label>
          <Rheostat
            min={0}
            max={24}
            values={[startTime, endTime]}
            onChange={handleChange}
            onValuesUpdated={handleValuesUpdated}
          />
        </Form.Group>
        <div className="row textCenter" style={{ paddingBottom: "10px" }}>
          <div className="col-6">Start: {tempStartTime}:00</div>
          <div className="col-6">End: {tempEndTime}:00</div>
        </div>

        <Form.Group controlId="maxGroupSize">
          <Form.Label>Max Group Size</Form.Label>
          <Form.Control
            type="number"
            value={maxGroupSize}
            onChange={(e) => setMaxGroupSize(e.target.value)}
          />
        </Form.Group>
        <div className="row textCenter">
          <div className="col-6">
            <Button variant="secondary" onClick={() => cancelFunc()}>
              Cancel
            </Button>
          </div>
          <div className="col-6">
            <Button variant="primary" type="submit">
              JoinMe!
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
