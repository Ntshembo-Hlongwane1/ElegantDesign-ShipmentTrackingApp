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
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const CurrentTime_1 = require("../../Utils/CurrentTimeFinder/CurrentTime");
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
                    const message = `Order Status: ${updatedUserPackage.status},driver assigned. Current Location:${userPackage.current_location[0]},
          TrackingID:${userPackage.Item_ID}.`;
                    const url = `https://jimba.co.za/sms.php?cell=${userPackage.owner_phoneNumber}&message=${message}`;
                    const data = yield axios_1.default.get(url);
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

                <h2>Package Current Location: ${userPackage.current_location[0]}</h2>

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
                }
                driver.assignedDeliveries = [driverID, ...driver.assignedDeliveries];
                const userPackage = yield ShipmentOrder_1.shipmentOrderModel.findOne({
                    _id: packageID,
                });
                userPackage.assignedDriver = driverName;
                userPackage.status = "Awaiting PickUp";
                const updatedUserPackage = yield ShipmentOrder_1.shipmentOrderModel.findOneAndUpdate({ _id: packageID }, userPackage, { new: true });
                const message = `Order Status: ${updatedUserPackage.status},driver assigned. Current Location:${userPackage.current_location[0]},
          TrackingID:${userPackage.Item_ID}.`;
                const url = `https://jimba.co.za/sms.php?cell=${userPackage.owner_phoneNumber}&message=${message}`;
                const data = yield axios_1.default.get(url);
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

              <h2>Package Current Location: ${userPackage.current_location[0]}</h2>

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
            }));
        }
        catch (error) {
            return response
                .status(500)
                .json({ msg: "Network Error: Failed to assign driver" });
        }
    }
    LeftWareHouse(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userSession = request.session.user || false;
            const username = userSession.username;
            const packageID = request.params.packageID;
            try {
                const userPackage = yield ShipmentOrder_1.shipmentOrderModel.findOne({
                    _id: packageID,
                });
                userPackage.status = "Left WareHouse";
                const currentTime = CurrentTime_1.GetTime();
                userPackage.pickupTime = currentTime;
                const updatePackage = yield ShipmentOrder_1.shipmentOrderModel.findOneAndUpdate({ _id: packageID }, userPackage, { new: true });
                const message = `Order Status: ${updatePackage.status}. Current Location:${userPackage.current_location[0]},
          TrackingID:${userPackage.Item_ID}.`;
                const url = `https://jimba.co.za/sms.php?cell=${userPackage.owner_phoneNumber}&message=${message}`;
                const data = yield axios_1.default.get(url);
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
                    subject: "Package Left Warhourse",
                    html: `
            
              <h1>Your order has been assigned a driver</h1>

              <h2>Package Current Location: ${userPackage.current_location[0]}</h2>

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
                        msg: "Status has been successfully updated, Sms and Email was sent to user",
                    });
                });
            }
            catch (error) {
                return response.status(500).json({
                    msg: "Network Error: Failed to change status to Left Warehouse",
                });
            }
        });
    }
    UpdatePackageLocaton(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userSession = request.session.user || false;
            const username = userSession.username;
            const packageID = request.params.packageID;
            const location = request.params.location;
            try {
                if (userSession) {
                    const userPackage = yield ShipmentOrder_1.shipmentOrderModel.findOne({
                        _id: packageID,
                    });
                    userPackage.current_location = [
                        location,
                        ...userPackage.current_location,
                    ];
                    const updatedUserPackage = yield ShipmentOrder_1.shipmentOrderModel.findOneAndUpdate({ _id: packageID }, userPackage, { new: true });
                    const message = `Order Status: ${updatedUserPackage.status}. Current Location:${updatedUserPackage.current_location[0]},
        TrackingID:${userPackage.Item_ID}.`;
                    const url = `https://jimba.co.za/sms.php?cell=${userPackage.owner_phoneNumber}&message=${message}`;
                    const data = yield axios_1.default.get(url);
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
                        subject: "Package Location Change",
                        html: `
          
            <h1>Your package location changed</h1>

            <h2>Package Current Location: ${userPackage.current_location[0]}</h2>

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
                            msg: "Location has been successfully updated, Sms and Email was sent to user",
                        });
                    });
                }
            }
            catch (error) {
                return response
                    .status(500)
                    .json({ msg: "Network Error: Failed to update package location" });
            }
        });
    }
}
exports.default = ShipmentUpdate;
//# sourceMappingURL=ShipmentOrderUpdater.js.map