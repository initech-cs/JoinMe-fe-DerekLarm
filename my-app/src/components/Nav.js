import React from "react";
import Navbar from "react-bootstrap/Navbar";

export default function Nav() {
  return (
    <div>
      <Navbar className="navBar">
        <div className="container">
          <Navbar.Brand href="/" className="navText">
            JoinMe<i class="fas fa-users"></i>
          </Navbar.Brand>
        </div>
      </Navbar>
    </div>
  );
}
