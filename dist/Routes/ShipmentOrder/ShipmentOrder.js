"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ShipmentOrder_1 = __importDefault(require("../../Controller/ShipmentOrder/ShipmentOrder"));
const ShipmentOrderController = new ShipmentOrder_1.default();
const router = express_1.Router();
router.post("/api/create-new-order", (request, response) => {
    ShipmentOrderController.CreateOrder(request, response);
});
router.get("/api/get-all-order", (request, response) => {
    ShipmentOrderController.FetchAllShipemtOrder(request, response);
});
exports.default = router;
//# sourceMappingURL=ShipmentOrder.js.map