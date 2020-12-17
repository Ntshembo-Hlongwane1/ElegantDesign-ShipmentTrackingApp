import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FetchAllOrder } from "../store/Actions/FetchAllOrder/FetchAllOrder";
import ScreenLoader from "../images/loadingScreen.gif";
import "../StyleSheet/AllShipmentOrder.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import AssignDriverForm from "./AssignDriverForm";
import "../StyleSheet/AssignDriverForm.css";
const AllShipmentOrder = () => {
  const { loading, ShipmentOrders, error } = useSelector(
    (state) => state.AllShipmentOrders
  );

  console.log(ShipmentOrders);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchAllOrder());
  }, [dispatch]);

  return (
    <div className="AllShimentOrders">
      <div className="orders__headers">
        <h1>All Orders</h1>
      </div>
      {loading ? (
        <img src={ScreenLoader} alt="" className="Screen-loader" />
      ) : error ? (
        <h4>{error}</h4>
      ) : (
        ShipmentOrders && (
          <div className="orders">
            {ShipmentOrders.map((item: any) => {
              return (
                <div className="order__details">
                  <div className="user__orders">
                    <h2>Package Owner</h2>
                    <div className="order__owner">
                      <h4>{`Package Owner: ${item.owner_fullName}`}</h4>
                      <h4>{`Email: ${item.owner_email}`}</h4>
                      <h4>{`Phone Number: ${item.owner_phoneNumber}`}</h4>
                    </div>
                  </div>
                  <div className="package__detail">
                    <h2>Package Details</h2>
                    <h4>{`Package ID: ${item.Item_ID}`}</h4>
                    <h4>{`Package Name: ${item.Item_name}`}</h4>
                    <h4>{`Package Weight: ${item.Item_weight}`}</h4>
                  </div>
                  <div className="package__location">
                    <h2>Package Location</h2>
                    <h4>{`Where package is coming from: ${item.Item_primaryLocation}`}</h4>
                    <h4>{`Where package is going: ${item.Item_destination}`}</h4>
                    <h4>{`Current Location: ${item.current_location}`}</h4>
                  </div>
                  <div className="package__status">
                    <h2>Order Status</h2>
                    <h4>{`Order Status: ${item.status}`}</h4>
                    <h4>{`Driver Confirmed Package: ${item.assignedDriverConfirmed}`}</h4>
                  </div>
                  <div className="package__driver">
                    <h2>Assigned Driver & Time Of PickUp / Arrival</h2>
                    <h4>{`Assigned Driver: ${
                      item.assignedDriver === "" ? "None" : item.assignedDriver
                    }`}</h4>
                    <h4>{`Pickup Time: ${
                      item.pickupTime === ""
                        ? "Awaiting PickUp"
                        : item.pickupTime
                    }`}</h4>
                    <h4>{`Arrival Time: ${
                      item.arrivalTime === ""
                        ? "Awaiting PickUp"
                        : item.arrivalTime
                    }`}</h4>
                  </div>
                  <div className="buttons-statuschanges">
                    <Popup
                      trigger={
                        <button
                          disabled={item.assignedDriver === "" ? false : true}
                        >
                          Assign Driver
                        </button>
                      }
                      position="right top"
                    >
                      <AssignDriverForm />
                    </Popup>

                    <button>Cancel Order</button>
                    <button
                      disabled={item.assignedDriver === "" ? false : true}
                    >
                      Request Package Confirmation (Driver)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default AllShipmentOrder;
