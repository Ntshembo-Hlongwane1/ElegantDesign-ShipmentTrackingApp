import React from "react";
import { useSelector } from "react-redux";
import "../StyleSheet/HomeNavMenus.css";
import { Link } from "react-router-dom";

const ShipmentTeamMenu = () => {
  const { authStatus } = useSelector((state) => state.userAuthStatus);

  return (
    <div className="ShipmentTeamMenu">
      {authStatus &&
      authStatus.auth_status === true &&
      authStatus.user_role === "shipmentTeam" ? (
        <div className="ShipmentTeamMenu">
          <div className="shipmentTeamMenu__assignedDeliveries">
            <h3 className="menu__link">Check Assigned Deliveries</h3>
          </div>
          <div className="shipmentTeamMenu__logout">
            <h3 className="menu__link">Logout</h3>
          </div>
        </div>
      ) : (
        <div className="shipmentTeamMenu__assignedDeliveries">
          <Link to="/user-signup/shipmentTeam" className="Router__link">
            <div className="shipmentTeamMenu__signup">
              <h3 className="menu__link">SignUp</h3>
            </div>
          </Link>
          <Link to="/user-sign/shipmentTeam" className="Router__link">
            <div className="shipmentTeamMenu__signin">
              <h3 className="menu__link">SignIn</h3>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ShipmentTeamMenu;
