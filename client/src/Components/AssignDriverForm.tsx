import React, { useState } from "react";
import "../StyleSheet/AssignDriverForm.css";
import axios from "axios";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { store } from "react-notifications-component";
import { ObjectId } from "mongoose";
interface PackageID {
  packageID: string;
}

const AssignDriverForm = (props: PackageID) => {
  const [driverName, setDriverName] = useState("");
  const [driverCompany, setDriverCompany] = useState("");
  const [driverID, setDriverID] = useState("");

  const AssignDriver = async (e: any) => {
    e.preventDefault();

    const form_data = new FormData();
    form_data.append("driverName", driverName);
    form_data.append("driverCompany", driverCompany);
    form_data.append("driverID", driverID);
    form_data.append("packageID", props.packageID);

    const baseURL = {
      dev: "http://localhost:5000/api/assign-driver",
      prod: "",
    };
    const url =
      process.env.NODE_ENV === "production" ? baseURL.prod : baseURL.dev;

    try {
      const { status, data } = await axios.post(url, form_data, {
        withCredentials: true,
      });
      ServerResponse(status, data.msg);
    } catch (error) {
      const { status, data } = error.response;
      ServerResponse(status, data.msg);
    }
  };

  const ServerResponse = (status: number, message: string) => {
    switch (status) {
      case 500:
        store.addNotification({
          title: "Assigning Driver Fail",
          message: message,
          type: "danger",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated", "animate_fadeIn"],
          animationOut: ["animate__animated", "animate_fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
        break;
      case 400:
        store.addNotification({
          title: "Assigning Driver Fail",
          message: message,
          type: "danger",
          insert: "top",
          container: "top-center",
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
          title: "Assigning Driver Success",
          message: message,
          type: "danger",
          insert: "top",
          container: "top-center",
          animationIn: ["animate__animated", "animate_fadeIn"],
          animationOut: ["animate__animated", "animate_fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
        break;
    }
  };

  return (
    <div className="AssignDriverForm">
      <form className="AssignDriverFrom-form">
        <label>Name Of Driver</label>
        <input
          type="text"
          placeholder="Name Of Driver"
          onChange={(e) => setDriverName(e.target.value)}
        />
        <label>Drivers Company</label>
        <input
          type="text"
          placeholder="Driver's Company"
          onChange={(e) => setDriverCompany(e.target.value)}
        />
        <label>Driver ID</label>
        <input
          type="text"
          placeholder="Driver ID"
          onChange={(e) => setDriverID(e.target.value)}
        />
        <button className="btn assign-driver-btn" onClick={AssignDriver}>
          Assign Driver
        </button>
      </form>
      <ReactNotification className="Notifaction-card assign_response" />
    </div>
  );
};

export default AssignDriverForm;
