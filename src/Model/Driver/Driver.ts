import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  driver_name: { type: String, required: true },
  driver_id: { type: String, required: true },
  assignedDeliveries: { type: Array, required: true },
});

export const driverModel = mongoose.model("driverModel", driverSchema);
