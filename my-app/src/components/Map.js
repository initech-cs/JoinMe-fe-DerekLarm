import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
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
  const [khoa, setKhoa] = useState([]);
  const [eventData, setEventData] = useState({});

  // DOUBLE CLICk MAP
  const onMapClick = useCallback((event) => {
    handleShow(event);
    console.log("Event Info:", event);

    setKhoa((current) => {
      console.log("current", current);
      return [
        ...current,
        {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          time: new Date(),
        },
      ];
    });
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
        khoa={khoa}
        setCoordinates={setCoordinates}
        setEventData={setEventData}
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
        className="map"
      >
        {coordinates.map((coordinate) => (
          <Marker
            key={coordinate.time.toISOString()}
            position={{ lat: coordinate.lat, lng: coordinate.lng }}
            icon={{
              url: "/profilePic.jpeg",
              scaledSize: new window.google.maps.Size(50, 50),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(30, 30),
            }}
            // POP UP EVENT DETAILS
            onClick={() => {
              setSelected(coordinate);
            }}
          />
        ))}
        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h2>{selected.label}</h2>
              <p>Created: {formatRelative(selected.time, new Date())}</p>
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
