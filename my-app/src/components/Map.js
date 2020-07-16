import React, { useState, useCallback, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import mapStyles from "../mapStyles";
import { Paginations, EventModal } from "./index";
import usePlacesAutocomplete, {
  getGeoCode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};
const center = {
  lat: 10.785478,
  lng: 106.696847,
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  disableDoubleClickZoom: true,
};

export default function Map(props) {
  const [show, setShow] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleShow = (e) => {
    setShow(true);
    setLat(e.latLng.lat());
    setLng(e.latLng.lng());
  };
  const handleClose = () => {
    setShow(false);
  };
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries,
  });

  const [coordinates, setCoordinates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rightClick, setRightClick] = useState(null);
  const [id, setId] = useState(null);

  const markerOptions = {
    clickable: true,
  };

  useEffect(() => {
    async function fetchData() {
      const data = await fetch(`http://localhost:5000/event`);
      const resp = await data.json();
      setCoordinates(resp);
      // setKhoa(resp);
      console.log("resp", resp);
    }
    fetchData();
  }, []);

  const deleteEvent = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:5000/event/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await fetch("http://localhost:5000/event");
    const resp = await data.json();
    setCoordinates(resp);
    setRightClick(null);
  };

  // DOUBLE CLICk MAP
  const onMapClick = useCallback((event) => {
    handleShow(event);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      {/* MODAL */}
      <EventModal
        lng={lng}
        lat={lat}
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        setCoordinates={setCoordinates}
      />
      <div className="searchBar">
        <Search />
      </div>
      <div className="pagination">
        <Paginations />
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
        options={options}
        onDblClick={onMapClick}
        onLoad={onMapLoad}
      >
        {coordinates.map((coordinate) => (
          <Marker
            options={markerOptions}
            key={coordinate._id}
            position={{ lat: coordinate.lat, lng: coordinate.lng }}
            icon={{
              url: "/profilePic.jpeg",
              scaledSize: new window.google.maps.Size(4, 4, "rem", "rem"),
              shape: new window.google.maps.Circle,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(30, 30),
            }}
            // label={coordinate.title}
            title={coordinate.title}
            // POP UP EVENT DETAILS
            onClick={() => {
              setSelected(coordinate);
              setRightClick(null);
            }}
            onRightClick={() => {
              setId(coordinate._id);
              setRightClick(coordinate);
              setSelected(null);
            }}
          >
            <div className="SEEMEEEE"></div>
          </Marker>
        ))}
        {rightClick ? (
          <InfoWindow
            position={{ lat: rightClick.lat, lng: rightClick.lng }}
            onCloseClick={() => setRightClick(null)}
          >
            <div>
              <Button type="submit" onClick={(e) => deleteEvent(e)}>
                Delete?
              </Button>
            </div>
          </InfoWindow>
        ) : null}
        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
              <p>Start Time: {selected.startTime}</p>
              <p>End Time: {selected.endTime}</p>
              <p>Max Group Size: {selected.maxGroupSize}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

function Search() {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestion,
  } = usePlacesAutocomplete({
    requestOptions: {
      locations: { lat: () => 10.785478, lng: () => 106.696847 },
      radius: 20 * 1000,
    },
  });
  return (
    <Combobox
      onSelect={(address) => {
        console.log(address);
      }}
    >
      <ComboboxInput
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={!ready}
        placeholder="Enter an address"
      />
    </Combobox>
  );
}
