import React from "react";
import { useSelector } from "react-redux";
import "../StyleSheet/AdminDashboard.css";
import { Link } from "react-router-dom";

const AdminDashBoard = () => {
  const { authStatus } = useSelector((state) => state.userAuthStatus);

  const AlertMessage = () => {
    alert("Feature Not Available in demo");
  };
  return (
    <div className="AdminDashBoard">
      {authStatus && (
        <div className="admin">
          <div className="admin__dashboardHeader">
            <h3 className="admin__dashBoardHeader">{`Welcome Back ${authStatus.username}`}</h3>
          </div>
          <div className="admin__dashboardContent">
            <Link className="Router__link" to="/admin-dashboard/all-orders">
              <div className="allDeliveries">
                <button className="btn-menu">All Shipments</button>
              </div>
            </Link>
            <div className="activeShipments">
              <button className="btn-menu" onClick={AlertMessage}>
                Active Shipment
              </button>
            </div>
            <Link to="/admin-dashboard/new-order" className="Router__link">
              <div className="takeInShipment">
                <button className="btn-menu">
                  Take In Shipment Packge Details
                </button>
              </div>
            </Link>
            <div className="FinishedShipments">
              <button className="btn-menu" onClick={AlertMessage}>
                All Finished Shipments
              </button>
            </div>
            <div className="allDrivers">
              <button className="btn-menu" onClick={AlertMessage}>
                Assign Driver For Shipment
              </button>
            </div>
            <div className="allDrivers">
              <button className="btn-menu" onClick={AlertMessage}>
                Pending Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashBoard;
