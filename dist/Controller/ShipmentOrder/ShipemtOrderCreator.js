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
const formidable_1 = require("formidable");
const nodemailer_1 = __importDefault(require("nodemailer"));
const ShipmentOrder_1 = require("../../Model/ShipmentOrders/ShipmentOrder");
const dotenv_1 = __importDefault(require("dotenv"));
const ShipmentOrderFetcher_1 = __importDefault(require("./ShipmentOrderFetcher"));
const Users_1 = require("../../Model/Users/Users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const PasswordGen_1 = require("../../Utils/Generators/PasswordGen");
dotenv_1.default.config();
class ShipmentOrderController extends ShipmentOrderFetcher_1.default {
    CreateOrder(request, response) {
        const form = new formidable_1.IncomingForm();
        try {
            form.parse(request, (error, fields) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return response
                        .status(500)
                        .json({ msg: "Network Error: Failed to create shipment order" });
                }
                const { owner_fullName, owner_email, owner_phoneNumber, Item_name, Item_weight, Item_primaryLocation, Item_destination, Item_ID, } = fields;
                if (!owner_email ||
                    !owner_fullName ||
                    !owner_phoneNumber ||
                    !Item_ID ||
                    !Item_destination ||
                    !Item_name ||
                    !Item_primaryLocation ||
                    !Item_weight) {
                    return response.status(500).json({ msg: "All fields are required" });
                }
                const isOrderExisting = yield ShipmentOrder_1.shipmentOrderModel.findOne({
                    Item_ID: Item_ID,
                });
                if (isOrderExisting) {
                    return response.status(400).json({
                        msg: `Order with this ID is already active with the status of ${isOrderExisting.status}`,
                    });
                }
                const newOrder = new ShipmentOrder_1.shipmentOrderModel({
                    owner_fullName,
                    owner_email,
                    owner_phoneNumber,
                    Item_name,
                    Item_weight,
                    Item_primaryLocation,
                    Item_destination,
                    Item_ID,
                });
                //0659827280//
                const savedOrder = yield newOrder.save();
                /*
                 * Endpoint --> https://jimba.co.za/sms.php?cell=0731820631&message=Tesing%20the%20app
                 */
                if (savedOrder) {
                    const current_location = savedOrder.current_location[0];
                    const message = `Order Status: Approved, awaiting driver to be assigned. Current Location:${current_location},
          TrackingID:${Item_ID}. Check Email for login details`;
                    const url = `https://jimba.co.za/sms.php?cell=${owner_phoneNumber}&message=${message}`;
                    const data = yield axios_1.default.get(url);
                    const user = yield Users_1.userModel.findOne({ username: owner_fullName });
                    if (user) {
                        return response.status(400).json({
                            msg: "Account with this username already exist give user another username",
                        });
                    }
                    const salt = yield bcrypt_1.default.genSalt(15);
                    const password = PasswordGen_1.passwordGenerator(15);
                    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
                    const newUser = new Users_1.userModel({
                        username: owner_fullName,
                        email: owner_email,
                        password: hashedPassword,
                        role: "Customer",
                    });
                    const savedUser = yield newUser.save();
                    const transporter = nodemailer_1.default.createTransport({
                        service: "SendinBlue",
                        auth: {
                            user: process.env.sendinBlue__login,
                            pass: process.env.sendinBlue__pass,
                        },
                    });
                    const messageOptions = {
                        from: "noreply@ElegantDesigns",
                        to: owner_email,
                        subject: "Approved Shipment Order",
                        html: `

                    <h1>Shipment Order Approved</h1>
                    <h3>Waiting for pickup to deliver your package</h3>
                    <h4>Shipment TrackingID: ${Item_ID}</h4>

                    <h1>Login Details</h1>
                    <h1>username:${owner_fullName}</h1>
                    <h1>pass:${password}</h1>

                    <h3 style="margin-top:3rem;">Queries?</h3>
                    <h4>Call: 0824566774</h4>
                    <h4>Email: ElegantDesign@gmail.com</h4>
                
                `,
                    };
                    transporter.sendMail(messageOptions, (error, info) => {
                        if (error) {
                            return response.status(500).json({
                                msg: `Network Error:Failed to send ${owner_fullName} an email @${owner_email}`,
                            });
                        }
                        return response.status(201).json({
                            msg: "Shipment Order has been successfully created, Sms and Email has been sent",
                        });
                    });
                }
            }));
        }
        catch (error) {
            return response
                .status(500)
                .json({ msg: "Network Error: Failed to create shipment order" });
        }
    }
}
exports.default = ShipmentOrderController;
//# sourceMappingURL=ShipemtOrderCreator.js.map