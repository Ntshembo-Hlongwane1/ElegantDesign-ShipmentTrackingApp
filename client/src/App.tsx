import React, { useEffect } from "react";
import Banner from "./Components/Banner";
import Header from "./Components/Header";
import "./StyleSheet/App.css";
import { useDispatch } from "react-redux";
import { isAutheticated } from "./store/Actions/Auth/Auth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";

const App = () => {
  // alert(window.location.href);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(isAutheticated());
  }, []);
  return (
    <Router>
      <Switch>
        <Route path="/user-signup/admin" exact={true}>
          <Header />
          <h1>Admin</h1>
        </Route>
        <Route path="/user-signup/customer" exact={true}>
          <Header />
          <h1>customer</h1>
        </Route>
        <Route path="/user-signup/shipment-team" exact={true}>
          <Header />
          <h1>ShipmentTeam</h1>
        </Route>
        <Route path="/" exact={true}>
          <Header />
          <Banner />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
