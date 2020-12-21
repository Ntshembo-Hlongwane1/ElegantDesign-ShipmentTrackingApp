import React from "react";
import "../StyleSheet/UpdateLocationForm.css";
interface Props {
  packageID: string;
}
const UpdatePackageLocation = (props: Props) => {
  return (
    <div className="PackageLocation">
      <label>Current Location</label>
      <input type="text" placeholder="Enter package current location" />
      <button className="btn">Update Location</button>
    </div>
  );
};

export default UpdatePackageLocation;
