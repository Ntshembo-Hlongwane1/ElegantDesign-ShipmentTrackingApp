import React, { useState } from "react";
import "../StyleSheet/AssignDriverForm.css";
import axios from "axios";

const AssignDriverForm = () => {
  const [driverName, setDriverName] = useState("");
  const [driverCompany, setDriverCompany] = useState("");
  const [driverID, setDriverID] = useState("");

  const AssignDriver = (e: any) => {
    e.preventDefault();

    const form_data = new FormData();
    form_data.append("driverName", driverName);
    form_data.append("driverCompany", driverCompany);
    form_data.append("driverID", driverID);

    alert(driverCompany);
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
    </div>
  );
};

export default AssignDriverForm;
