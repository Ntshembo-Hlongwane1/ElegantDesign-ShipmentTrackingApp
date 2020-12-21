"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ShipmentOrder_1 = require("../../Model/ShipmentOrders/ShipmentOrder");
const ShipmentOrderUpdater_1 = __importDefault(require("./ShipmentOrderUpdater"));
class ShipmentOrderFetcher extends ShipmentOrderUpdater_1.default {
    FetchAllShipemtOrder(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield ShipmentOrder_1.shipmentOrderModel.find();
                return response.status(200).json(data);
            }
            catch (error) {
                return response
                    .status(500)
                    .json({ msg: "Network Error: Failed to fetch all Shipment Orders" });
            }
        });
    }
    FetchSpecificOrder(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userSession = request.session.user || false;
            const username = userSession.username;
            try {
                const userOrders = yield ShipmentOrder_1.shipmentOrderModel.find({
                    owner_fullName: username,
                });
                return response.status(200).json(userOrders);
            }
            catch (error) {
                return response
                    .status(500)
                    .json({ msg: "Network Error: Failed to fetch all shipment Orders" });
            }
        });
    }
}
exports.default = ShipmentOrderFetcher;
//# sourceMappingURL=ShipmentOrderFetcher.js.map