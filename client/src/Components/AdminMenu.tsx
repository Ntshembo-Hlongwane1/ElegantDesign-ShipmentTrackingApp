import React from "react";
import { useSelector } from "react-redux";
import "../StyleSheet/HomeNavMenus.css";
import { Link, useHistory } from "react-router-dom";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { store } from "react-notifications-component";
import axios from "axios";

const AdminMenu = () => {
  const { authStatus } = useSelector((state) => state.userAuthStatus);
  const history = useHistory();

  const RedirectUser = () => {
    history.push("/");
    window.location.reload(false);
  };
  const LogUserOut = async () => {
    const baseURL = {
      dev: "http://localhost:5000/api/logout",
      prod: "",
    };
    const url =
      process.env.NODE_ENV === "production" ? baseURL.prod : baseURL.dev;

    try {
      const { data, status } = await axios.get(url, { withCredentials: true });
      LogOutServerResponseAlert(status, data.msg);
    } catch (error) {
      const { data, status } = error.response;
      LogOutServerResponseAlert(status, data.msg);
    }
  };

  const LogOutServerResponseAlert = (status: number, message: string) => {
    switch (status) {
      case 500:
        store.addNotification({
          title: "LogOut Fail",
          message: message,
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate_fadeIn"],
          animationOut: ["animate__animated", "animate_fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
        break;
      case 200:
        store.addNotification({
          title: "LogOut  Success",
          message: message,
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate_fadeIn"],
          animationOut: ["animate__animated", "animate_fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
          onRemoval: () => {
            RedirectUser();
          },
        });
        break;
    }
  };

  return (
    <div className="Admin">
      {authStatus &&
      authStatus.auth_status === true &&
      authStatus.user_role === "admin" ? (
        <div className="Admin__menu">
          <Link to="/admin-dashboard" className="Router__link">
            <div className="menu__Dashboard">
              <h3 className="menu__link">DashBoard</h3>
            </div>
          </Link>
          <div className="menu__logout" onClick={LogUserOut}>
            <h3 className="menu__link">Logout</h3>
          </div>
        </div>
      ) : (
        <div className="Admin__menu">
          <Link to="/user-signup/admin" className="Router__link">
            <div className="menu__signUp">
              <h3 className="menu__link">SignUp</h3>
            </div>
          </Link>
          <Link to="/user-signin/admin" className="Router__link">
            <div className="menu__signIn">
              <h3 className="menu__link">SignIn</h3>
            </div>
          </Link>
        </div>
      )}
      <ReactNotification className="Notifaction-card" />
    </div>
  );
};

export default AdminMenu;
