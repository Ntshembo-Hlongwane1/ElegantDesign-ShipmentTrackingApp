import mongoose from "mongoose";

const shipmentOrderSchema = new mongoose.Schema({
  owner_fullName: { type: String, required: true },
  owner_email: { type: String, required: true },
  owner_phoneNumber: { type: String, required: true },

  Item_name: { type: String, required: true },
  Item_weight: { type: String, required: true },
  Item_primaryLocation: { type: String, required: true },
  Item_destination: { type: String, required: true },
  Item_ID: { type: String, required: true },

  current_location: { type: Array, default: ["Gauteng"] },
  assignedDriver: { type: String, default: "" },
  status: { type: String, default: "Approved" },

  pickupTime: { type: String, default: "" },
  arrivalTime: { type: String, default: "" },
});

export const shipmentOrderModel = mongoose.model(
  "shipmentOrdersModel",
  shipmentOrderSchema
);
