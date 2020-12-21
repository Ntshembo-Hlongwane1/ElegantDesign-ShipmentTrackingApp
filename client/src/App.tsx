import React, { useEffect } from "react";
import Banner from "./Components/Banner";
import Header from "./Components/Header";
import "./StyleSheet/App.css";
import { useDispatch } from "react-redux";
import { isAutheticated } from "./store/Actions/Auth/Auth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import AdminDashBoard from "./Components/AdminDashBoard";
import TakeNewOrder from "./Components/TakeNewOrder";
import AllShipmentOrder from "./Components/AllShipmentOrder";
import ShipmentHistory from "./Components/ShipmentHistory";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(isAutheticated());
  }, [dispatch]);
  return (
    <Router>
      <Switch>
        <Route path="/user-signup/:user_role" exact={true}>
          <Header />
          <SignUp />
        </Route>
        <Route path="/shipment-history" exact={true}>
          <Header />
          <ShipmentHistory />
        </Route>
        <Route path="/user-signin/:user_role" exact={true}>
          <Header />
          <SignIn />
        </Route>
        <Route path="/admin-dashboard/new-order" exact={true}>
          <Header />
          <TakeNewOrder />
        </Route>
        <Route path="/admin-dashboard/all-orders" exact={true}>
          <Header />
          <AllShipmentOrder />
        </Route>
        <Route path="/admin-dashboard" exact={true}>
          <Header />
          <AdminDashBoard />
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
