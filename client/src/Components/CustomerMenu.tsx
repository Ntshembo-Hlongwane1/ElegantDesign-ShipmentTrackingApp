import React from "react";
import { useSelector } from "react-redux";
import "../StyleSheet/HomeNavMenus.css";
import { Link, useHistory } from "react-router-dom";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { store } from "react-notifications-component";
import axios from "axios";

const CustomerMenu = () => {
  const { authStatus } = useSelector((state) => state.userAuthStatus);
  const history = useHistory();
  // alert(JSON.stringify(authStatus));
  const AlertERror = () => {
    alert("Functionality not available in demo");
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
  const RedirectUser = () => {
    history.push("/");
    window.location.reload(false);
  };
  return (
    <div className="CustomerMenu">
      {authStatus &&
      authStatus.auth_status === true &&
      authStatus.user_role === "Customer" ? (
        <div className="customerMenu">
          <Link to="/shipment-history" className="Router__link">
            <div className="customerMenu__history">
              <h3 className="menu__link">Shipment History</h3>
            </div>
          </Link>
          <div className="customerMenu" onClick={AlertERror}>
            <h3 className="menu__link">Track Shipments</h3>
          </div>
          <div className="customerMenu">
            <h3 className="menu__link" onClick={LogUserOut}>
              LogOut
            </h3>
          </div>
        </div>
      ) : (
        <div className="customerMenu">
          <Link to="/user-signin/customer" className="Router__link">
            <div className="customerMenu__signin">
              <h3 className="menu__link">SignIn</h3>
            </div>
          </Link>
        </div>
      )}
      <ReactNotification className="Notifaction-card" />
    </div>
  );
};

export default CustomerMenu;
