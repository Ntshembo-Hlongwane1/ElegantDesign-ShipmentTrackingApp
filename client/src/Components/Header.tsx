import React from "react";
import "../StyleSheet/Header.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import AdminMenu from "./AdminMenu";
import CustomerMenu from "./CustomerMenu";
import ShipmentTeamMenu from "./ShipmentTeamMenu";

const Header = () => {
  return (
    <nav className="Header">
      <div className="Header__top">
        <h4 className="headerTop__companyName">Elegant Design</h4>
      </div>
      <div className="Header__bottom">
        <div className="Header__home">
          <h4 className="nav-link">Home</h4>
        </div>
        <div className="Header__admin">
          <Popup
            trigger={<h4 className="nav-link">Admin</h4>}
            position="bottom center"
          >
            <AdminMenu />
          </Popup>
        </div>
        <div className="Header__customer">
          <Popup
            trigger={<h4 className="nav-link">Customer</h4>}
            position="bottom center"
          >
            <CustomerMenu />
          </Popup>
        </div>
        <div className="Header__shipementCrew">
          <Popup
            trigger={<h4 className="nav-link">Shipment Team</h4>}
            position="bottom center"
          >
            <ShipmentTeamMenu />
          </Popup>
        </div>
      </div>
    </nav>
  );
};

export default Header;
