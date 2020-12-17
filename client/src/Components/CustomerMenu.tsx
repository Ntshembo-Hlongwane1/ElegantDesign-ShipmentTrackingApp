import React from "react";
import { useSelector } from "react-redux";
import "../StyleSheet/HomeNavMenus.css";
import { Link } from "react-router-dom";

const CustomerMenu = () => {
  const { authStatus } = useSelector((state) => state.userAuthStatus);

  return (
    <div className="CustomerMenu">
      {authStatus &&
      authStatus.auth_status === true &&
      authStatus.user_role === "customer" ? (
        <div className="customerMenu">
          <div className="customerMenu__history">
            <h3 className="menu__link">Shipment History</h3>
          </div>
          <div className="customerMenu">
            <h3 className="menu__link">Track Shipments</h3>
          </div>
          <div className="customerMenu">
            <h3 className="menu__link">LogOut</h3>
          </div>
        </div>
      ) : (
        <div className="customerMenu">
          <Link to="/user-signup/customer" className="Router__link">
            <div className="cutomerMenu__signup">
              <h3 className="menu__link">SignUp</h3>
            </div>
          </Link>

          <Link to="/user-signin/customer" className="Router__link">
            <div className="customerMenu__signin">
              <h3 className="menu__link">SignIn</h3>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;
