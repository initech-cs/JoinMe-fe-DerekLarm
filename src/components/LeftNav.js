import React from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";

export default function LeftNav(props) {
  const friendArray = [
    {
      _id: "5f102efe265f31c8b4e48a12",
      name: "Bobby",
      pic: "/profilePic.png",
    },
    {
      _id: "5f102efe265f31c8b4e48a12",
      name: "Derek",
      pic: "/profilePic.png",
    },
    {
      _id: "5f102efe265f31c8b4e48a12",
      name: "Cindy",
      pic: "/profilePic.png",
    },
    {
      _id: "5f102efe265f31c8b4e48a12",
      name: "Janet",
      pic: "/profilePic.png",
    },
  ];

  return (
    <div className="leftNav">
      <DropdownButton id="dropdown-item-button" title="">
        <div className="dropdownMenu">
          <Dropdown.Item as="button" onClick={() => props.eventShow(true)}>
            All Events
          </Dropdown.Item>
          <Dropdown.Item as="button">Your Events</Dropdown.Item>
          <br></br>
          <p style={{ textAlign: "center", fontWeight: "bold" }}>Friend List</p>
          <Dropdown.Divider />

          {friendArray.map((id) => (
            <Dropdown.Item href="/login" key={id.name}>
              <div>
                <table style={{ width: "100%" }}>
                  <tr>
                    <td>
                      <img className="friendPic" src={id.pic} alt="profile-pic"></img>
                    </td>
                    <td>{id.name}</td>
                  </tr>
                </table>
              </div>
            </Dropdown.Item>
          ))}
        </div>
      </DropdownButton>
    </div>
  );
}
