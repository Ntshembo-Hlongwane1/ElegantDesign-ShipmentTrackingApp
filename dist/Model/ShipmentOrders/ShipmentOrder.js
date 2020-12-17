"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentOrderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const shipmentOrderSchema = new mongoose_1.default.Schema({
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
exports.shipmentOrderModel = mongoose_1.default.model("shipmentOrdersModel", shipmentOrderSchema);
//# sourceMappingURL=ShipmentOrder.js.map