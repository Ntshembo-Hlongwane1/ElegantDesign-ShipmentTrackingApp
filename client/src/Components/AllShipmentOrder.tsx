import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FetchAllOrder } from "../store/Actions/FetchAllOrder/FetchAllOrder";
import ScreenLoader from "../images/loadingScreen.gif";
import "../StyleSheet/AllShipmentOrder.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import AssignDriverForm from "./AssignDriverForm";
import "../StyleSheet/AssignDriverForm.css";
import UpdatePackageLocation from "./UpdatePackageLocation";
import axios from "axios";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { store } from "react-notifications-component";

const AllShipmentOrder = () => {
  const { loading, ShipmentOrders, error } = useSelector(
    (state) => state.AllShipmentOrders
  );

  const [toggle, setToggle] = useState(false);
  console.log(ShipmentOrders);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchAllOrder());
  }, [dispatch]);

  const ToggleCard = () => {
    setToggle(!toggle);
  };

  const ServerResponse = (status: number, message: string) => {
    switch (status) {
      case 500:
        store.addNotification({
          title: "Shipment Status Change Fail",
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
          title: "Shipment Status Change Success",
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
        });
    }
  };

  const LeftWareHouse = async (ID: string) => {
    const baseURL = {
      dev: `http://localhost:5000/api/left-warehouse/${ID}`,
      prod: "",
    };
    const url =
      process.env.NODE_ENV === "production" ? baseURL.prod : baseURL.dev;

    try {
      const { data, status } = await axios.get(url, { withCredentials: true });
      ServerResponse(status, data.msg);
      console.log(data);
    } catch (error) {
      const { data, status } = error.response;
      ServerResponse(status, data.msg);
    }
  };

  const Alert = () => {
    alert("Function not available on demo");
  };
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
            {ShipmentOrders.map((item: any, idx: number) => {
              return (
                <div className="order__details" key={item._id}>
                  <div className="user__orders">
                    <h2>{`Package Owner: Order #${idx + 1}`}</h2>
                    <div className="order__owner">
                      <h4>{`Package Owner: ${item.owner_fullName}`}</h4>
                      <h4>{`Email: ${item.owner_email}`}</h4>
                      <h4>{`Phone Number: ${item.owner_phoneNumber}`}</h4>
                      <h4>{`Package ID: ${item.Item_ID}`}</h4>
                    </div>
                    {toggle ? null : (
                      <button
                        className="btn show-more-btn"
                        onClick={ToggleCard}
                      >
                        Show More
                      </button>
                    )}
                  </div>
                  {toggle === false ? null : (
                    <div className="details">
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
                          item.assignedDriver === ""
                            ? "None"
                            : item.assignedDriver
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
                              disabled={
                                item.assignedDriver === "" ? false : true
                              }
                            >
                              Assign Driver
                            </button>
                          }
                          position="right top"
                        >
                          <AssignDriverForm packageID={item._id} />
                        </Popup>

                        <button onClick={() => LeftWareHouse(item._id)}>
                          Left WareHouse
                        </button>
                        <button onClick={Alert}>Package Arrived</button>
                        <Popup
                          trigger={<button>Update Package Location</button>}
                          position="right top"
                        >
                          <UpdatePackageLocation packageID={item._id} />
                        </Popup>
                      </div>
                      {toggle ? (
                        <button
                          className="btn show-more-btn"
                          onClick={ToggleCard}
                        >
                          Close
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
      <ReactNotification className="Notifaction-card" />
    </div>
  );
};

export default AllShipmentOrder;
