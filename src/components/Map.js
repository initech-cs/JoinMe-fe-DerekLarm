import React, { useState, useCallback, useEffect } from "react";
import { Button, Navbar, Modal, Dropdown } from "react-bootstrap";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
// import { formatRelative } from "date-fns";
import mapStyles from "../mapStyles";
import { Paginations, EventModal, PaginationLink, LeftNav } from "./index";
// import App from "../App";
import usePlacesAutocomplete, {
  getGeocode,
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
import moment from "moment";

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
  const [lat, setLat] = useState(10.785478);
  const [lng, setLng] = useState(106.696847);

  const handleShow = async (e) => {
    await setLat(e.latLng.lat());
    await setLng(e.latLng.lng());
    setShow(true);
    // reverseGeo();
  };

  const searchShow = async (e) => {
    setLat(e.lat);
    setLng(e.lng);
    setShow(true);
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
  const [eventList, setEventList] = useState(null);
  const [modalEvents, setModalEvents] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [maxPageNum, setMaxPageNum] = useState(1);
  const [streetAddress, setStreetAddress] = useState("");
  const [apiDate, setApiDate] = useState(moment("MMDDYYYY"));
  // eslint-disable-next-line

  const markerOptions = {
    clickable: true,
  };

  // FETCH TO MAP MARKERS

  // FETCH CERTAIN DAY
  useEffect(() => {
    async function fetchData() {
      const data = await fetch(
        `${process.env.REACT_APP_API_URL}/event/${apiDate}`
      );
      const resp = await data.json();
      setCoordinates(resp);
      console.log("EVENTS: ", resp);
    }
    fetchData();
  }, [apiDate]);

  // FETCH TO PAGINATE
  useEffect(() => {
    async function fetchData() {
      const data = await fetch(
        `${process.env.REACT_APP_API_URL}/event/modal?page=${pageNum}`
      );
      const resp = await data.json();
      setModalEvents(resp.data);
      setMaxPageNum(parseInt(resp.maxPageNum));
    }
    fetchData();
  }, [pageNum, coordinates]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_API_KEY}`
      );
      const resp = await data.json();
      if (
        !resp.results ||
        resp.results.length === 0 ||
        !resp.results[0].formatted_address
      ) {
        return <div>Loading</div>;
      } else {
        setStreetAddress(resp.results[0].formatted_address);
      }
    }
    fetchData();
  }, [lat, lng]);

  const goNextPage = () => {
    setPageNum(pageNum + 1);
  };

  const goPrevPage = () => {
    setPageNum(pageNum - 1);
  };

  const eventShow = (e) => {
    setPageNum(1);
    setEventList(e);
  };

  const deleteEvent = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_API_URL}/event/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/event/${apiDate}`
    );
    const resp = await data.json();
    setCoordinates(resp);
    setRightClick(null);
  };

  // SHOW ALL EVENTS
  const allEvents = async (e) => {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/event`);
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

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
  }, []);

  const detailPanTo = useCallback((id) => {
    const lat = id.lat;
    const lng = id.lng;
    console.log(lng, lat);
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
    setSelected(id);
    eventShow(false);
  }, []);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      <div className="blackBox">
        <Navbar.Brand className="navText">
          JoinMe<i class="fas fa-users"></i>
        </Navbar.Brand>
      </div>
      <Modal show={eventList} size="xl">
        <Modal.Body className="eventModal">
          <table style={{ width: "100%" }}>
            <tbody style={{ textAlign: "center" }}>
              <tr>
                <td width={25}>Title:</td>
                <td width={25}>Created by:</td>
                <td width={25}>Date:</td>
                <td width={25}>Details:</td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <Dropdown.Divider />
                </td>
              </tr>

              {modalEvents.map((id) => (
                <tr key={id._id} style={{ height: "50px" }}>
                  <td width={25}>{id.title}</td>
                  <td width={25}>{id.name}</td>
                  <td width={25}>{id.date}</td>
                  <td width={25}>
                    <Button onClick={() => detailPanTo(id)}>Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer className="eventModal">
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <PaginationLink
                    disabled={pageNum === 1}
                    handleClick={goPrevPage}
                  >
                    Previous Page
                  </PaginationLink>
                </td>
                <td style={{ textAlign: "center" }}>
                  <PaginationLink
                    disabled={pageNum === maxPageNum}
                    handleClick={goNextPage}
                  >
                    Next Page
                  </PaginationLink>
                </td>
              </tr>
            </tbody>
          </table>

          <Button
            centered
            style={{ width: "100%", marginLeft: "0" }}
            variant="secondary"
            onClick={() => eventShow(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* CREATE EVENT MODAL */}
      <EventModal
        streetAddress={streetAddress}
        lng={lng}
        lat={lat}
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        setCoordinates={setCoordinates}
        day={props.day}
        user={props.user}
        apiDate={apiDate}
      />
      <Search panTo={panTo} searchShow={searchShow} lat={lat} lng={lng} />
      <Locate panTo={panTo} />
      <section style={{ width: "100vw" }}>
        <div className="pagination">
          <Paginations
            setDay={props.setDay}
            setApiDate={setApiDate}
            allEvents={allEvents}
          />
        </div>
      </section>

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
              // url: `/${props.user.name}.png`,
              url: "/Derek.png",
              scaledSize: new window.google.maps.Size(4, 4, "rem", "rem"),
              shape: new window.google.maps.Circle(),
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
          ></Marker>
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
            <table style={{ width: "100%" }}>
              {console.log(selected)}
              <tbody style={{ textAlign: "center" }}>
                <tr>
                  <td colSpan={2}>
                    <h5>{selected.title}</h5>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ textAlign: "left" }}>
                    <p>
                      <b>Created by: </b> {selected.name}
                    </p>
                    <hr />
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} style={{ textAlign: "left" }}>
                    <p>
                      <b>Description: </b> {selected.description}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ textAlign: "left" }}>
                    <p>
                      <b>Date: </b>
                      {selected.date}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    <p>
                      <b>Start: </b> {selected.startTime}:00
                    </p>
                  </td>
                  <td style={{ textAlign: "left" }}>
                    <p>
                      <b>End: </b> {selected.endTime}:00
                    </p>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <a
                      target="_blank"
                      href={`https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`}
                    >
                      {`Open in Google Maps: `}
                    </a>
                    {selected.address}
                  </td>
                </tr>
              </tbody>
            </table>
          </InfoWindow>
        ) : null}
      </GoogleMap>
      <LeftNav eventShow={eventShow} />
      {/* <Button onClick={() => reverseGeo()}>REversee</Button> */}
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null,
          options
        );
      }}
    >
      <i class="far fa-compass"></i>
    </button>
  );
}

function Search({ panTo, searchShow, lat, lng }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => lat, lng: () => lng },
      radius: 20 * 1000,
    },
  });
  return (
    <div className="searchBar">
      <Combobox
        onSelect={async (address) => {
          console.log(address);
          setValue(address, false);
          clearSuggestions();
          try {
            const result = await getGeocode({ address });
            const { lat, lng } = await getLatLng(result[0]);
            panTo({ lat, lng });
            searchShow({ lat, lng });
            setValue("");
          } catch (error) {
            console.log("error");
          }
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
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
