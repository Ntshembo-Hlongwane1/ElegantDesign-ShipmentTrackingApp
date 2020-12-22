import React, { useState } from "react";
import "../StyleSheet/UpdateLocationForm.css";
import axios from "axios";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { store } from "react-notifications-component";
interface Props {
  packageID: string;
}

const UpdateLocation = () => {
  const baseURL = {
    dev: "http://localhost:5000/api/update-location/:packageID/:location",
    prod: "",
  };
};
const UpdatePackageLocation = (props: Props) => {
  const [location, setLocation] = useState("");

  const ServerResponse = (status: number, message: string) => {
    switch (status) {
      case 500:
        store.addNotification({
          title: "Update Status Fail",
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
          title: "Status Update Success",
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
  const UpdateLocation = async () => {
    try {
      const { data, status } = await axios.get(
        `http://localhost:5000/api/update-location/${props.packageID}/${location}`
      );
      ServerResponse(status, data.msg);
      console.log(data);
    } catch (error) {
      const { data, status } = error.response;
      ServerResponse(status, data.msg);
    }
    // alert("test");
  };
  return (
    <div className="PackageLocation">
      <label>Current Location</label>
      <input
        type="text"
        placeholder="Enter package current location"
        onChange={(e) => setLocation(e.target.value)}
      />
      <button className="btn" onClick={UpdateLocation}>
        Update Location
      </button>
      <ReactNotification className="Notifaction-card" />
    </div>
  );
};

export default UpdatePackageLocation;
