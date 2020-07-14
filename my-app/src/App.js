import React, { useState } from "react";
import "./App.css";
// import Home from "./views/Home";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Map, EventModal, Nav } from "./components/index";
import "rheostat/initialize";
import "rheostat/css/rheostat.css";

function App() {

  return (
    <div>
      {/* <Router>
        <Switch>
          <Route path="/event" exact component={Event} />
          <Route path="/" exact component={Home} />
        </Switch>
      </Router> */}
      <Nav />
      <Map />
    </div>
  );
}

export default App;
