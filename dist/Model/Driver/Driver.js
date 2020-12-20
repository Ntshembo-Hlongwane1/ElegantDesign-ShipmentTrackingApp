"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const driverSchema = new mongoose_1.default.Schema({
    driver_name: { type: String, required: true, unique: true },
    driver_id: { type: String, required: true },
    assignedDeliveries: { type: Array, required: true },
});
exports.driverModel = mongoose_1.default.model("driverModel", driverSchema);
//# sourceMappingURL=Driver.js.map