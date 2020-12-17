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

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(isAutheticated());
  }, []);
  return (
    <Router>
      <Switch>
        <Route path="/user-signup/:user_role" exact={true}>
          <Header />
          <SignUp />
        </Route>
        <Route path="/user-signin/:user_role" exact={true}>
          <Header />
          <SignIn />
        </Route>
        <Route path="/admin-dashboard/new-order" exact={true}>
          <Header />
          <TakeNewOrder />
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
