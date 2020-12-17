import React from "react";
import { useSelector } from "react-redux";
import "../StyleSheet/AdminDashboard.css";
import { Link } from "react-router-dom";

const AdminDashBoard = () => {
  const { authStatus } = useSelector((state) => state.userAuthStatus);

  return (
    <div className="AdminDashBoard">
      {authStatus && (
        <div className="admin">
          <div className="admin__dashboardHeader">
            <h3 className="admin__dashBoardHeader">{`Welcome Back ${authStatus.username}`}</h3>
          </div>
          <div className="admin__dashboardContent">
            <div className="allDeliveries">
              <h4>All Shipments</h4>
            </div>
            <div className="activeShipments">
              <h4>Active Shipment</h4>
            </div>
            <Link to="/admin-dashboard/new-order" className="Router__link">
              <div className="takeInShipment">
                <h4>Take In Shipment Packge Details</h4>
              </div>
            </Link>
            <div className="FinishedShipments">
              <h4>All Finished Shipments</h4>
            </div>
            <div className="allDrivers">
              <h4>Assign Driver For Shipment</h4>
            </div>
            <div className="allDrivers">
              <h4>Pending Order</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashBoard;
