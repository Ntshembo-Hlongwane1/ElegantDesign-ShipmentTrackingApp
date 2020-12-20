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
const ShipmentOrder_1 = require("../../Model/ShipmentOrders/ShipmentOrder");
const Driver_1 = require("../../Model/Driver/Driver");
const nodemailer_1 = __importDefault(require("nodemailer"));
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class ShipmentUpdate {
    AssignDriver(request, response) {
        const form = new formidable_1.IncomingForm();
        try {
            form.parse(request, (error, fields) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return response
                        .status(500)
                        .json({ msg: "Network Error: Failed to assign driver" });
                }
                const { driverName, driverCompany, driverID, packageID } = fields;
                if (!driverCompany || !driverName || !driverID || !packageID) {
                    return response.status(400).json({ msg: "All fields are required" });
                }
                const driver = yield Driver_1.driverModel.findOne({
                    driver_name: driverName,
                });
                if (!driver) {
                    const newDriver = new Driver_1.driverModel({
                        driver_name: driverName,
                        driver_id: driverID,
                        assignedDeliveries: driverID,
                    });
                    const savedDriver = yield newDriver.save();
                    const userPackage = yield ShipmentOrder_1.shipmentOrderModel.findOne({
                        _id: packageID,
                    });
                    userPackage.assignedDriver = driverName;
                    userPackage.status = "Awaiting PickUp";
                    const updatedUserPackage = yield ShipmentOrder_1.shipmentOrderModel.findOneAndUpdate({ _id: packageID }, userPackage, { new: true });
                    const twilio__AccountSiD = process.env.twilio__accountSiD;
                    const twilio__authToken = process.env.twilio__authToken;
                    const client = twilio_1.default(twilio__AccountSiD, twilio__authToken);
                    const message = `A driver has been assigned to ship your package await pickup date, confirmation will be sent`;
                    const messageOptions = {
                        body: message,
                        from: process.env.twilio__number,
                        to: process.env.test__number,
                    };
                    client.messages.create(messageOptions, (errro, item) => {
                        if (error) {
                            return response.status(500).json({
                                msg: `Failed to send Sms to ${userPackage.owner_fullName} having Number: ${process.env.test__number}`,
                            });
                        }
                        const transporter = nodemailer_1.default.createTransport({
                            service: "SendinBlue",
                            auth: {
                                user: process.env.sendinBlue__login,
                                pass: process.env.sendinBlue__pass,
                            },
                        });
                        const messageOptions = {
                            from: process.env.sendinBlue__login,
                            to: userPackage.owner_email,
                            subject: "Order Assigned A Driver",
                            html: `
              
                <h1>Your order has been assigned a driver</h1>
                <h3>Name:${driverName}</h3>
                <h3>Company:${driverCompany}</h3>
                <h3>DriverID:${driverID}</h3>

                <h4 style="margin-top:4rem;">Any Queries?</h4>
                <h4>Email: elegantdesigns@gmail.com</h4>
                <h4>Contact: 0215266698</h4>
              
              `,
                        };
                        transporter.sendMail(messageOptions, (error, info) => {
                            if (error) {
                                return response.status(500).json({
                                    msg: `Failed to send email to ${userPackage.owner_fullName} with an email: ${userPackage.owner_email}`,
                                });
                            }
                            return response.status(200).json({
                                msg: "Driver has been successfully assigned, Sms and Email was sent to user",
                            });
                        });
                    });
                }
                driver.assignedDeliveries = [driverID, ...driver.assignedDeliveries];
                const userPackage = yield ShipmentOrder_1.shipmentOrderModel.findOne({
                    _id: packageID,
                });
                userPackage.assignedDriver = driverName;
                userPackage.status = "Awaiting PickUp";
                const updatedUserPackage = yield ShipmentOrder_1.shipmentOrderModel.findOneAndUpdate({ _id: packageID }, userPackage, { new: true });
                const twilio__AccountSiD = process.env.twilio__accountSiD;
                const twilio__authToken = process.env.twilio__authToken;
                const client = twilio_1.default(twilio__AccountSiD, twilio__authToken);
                const message = `A driver has been assigned to ship your package await pickup date, confirmation will be sent`;
                const messageOptions = {
                    body: message,
                    from: process.env.twilio__number,
                    to: process.env.test__number,
                };
                client.messages.create(messageOptions, (errro, item) => {
                    if (error) {
                        return response.status(500).json({
                            msg: `Failed to send Sms to ${userPackage.owner_fullName} having Number: ${process.env.test__number}`,
                        });
                    }
                    const transporter = nodemailer_1.default.createTransport({
                        service: "SendinBlue",
                        auth: {
                            user: process.env.sendinBlue__login,
                            pass: process.env.sendinBlue__pass,
                        },
                    });
                    const messageOptions = {
                        from: process.env.sendinBlue__login,
                        to: userPackage.owner_email,
                        subject: "Order Assigned A Driver",
                        html: `
              
                <h1>Your order has been assigned a driver</h1>
                <h3>Name:${driverName}</h3>
                <h3>Company:${driverCompany}</h3>
                <h3>DriverID:${driverID}</h3>

                <h4 style="margin-top:4rem;">Any Queries?</h4>
                <h4>Email: elegantdesigns@gmail.com</h4>
                <h4>Contact: 0215266698</h4>
              
              `,
                    };
                    transporter.sendMail(messageOptions, (error, info) => {
                        if (error) {
                            return response.status(500).json({
                                msg: `Failed to send email to ${userPackage.owner_fullName} with an email: ${userPackage.owner_email}`,
                            });
                        }
                        return response.status(200).json({
                            msg: "Driver has been successfully assigned, Sms and Email was sent to user",
                        });
                    });
                });
            }));
        }
        catch (error) {
            return response
                .status(500)
                .json({ msg: "Network Error: Failed to assign driver" });
        }
    }
}
exports.default = ShipmentUpdate;
//# sourceMappingURL=ShipmentOrderUpdater.js.map