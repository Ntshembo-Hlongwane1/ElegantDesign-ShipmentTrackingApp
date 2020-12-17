import { IncomingForm, Fields } from "formidable";
import { shipmentOrderModel } from "../../Model/ShipmentOrders/ShipmentOrder";
import { Request, Response } from "express";
import { driverModel } from "../../Model/Driver/Driver";
import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

interface ShipmentUpdater {
  AssignDriver(request: Request, response: Response);
}

class ShipmentUpdate implements ShipmentUpdater {
  AssignDriver(request: Request, response: Response) {
    const form = new IncomingForm();

    try {
      form.parse(request, async (error, fields: Fields) => {
        if (error) {
          return response
            .status(500)
            .json({ msg: "Network Error: Failed to assign driver" });
        }

        const { driverName, driverCompany, driverID, packageID } = fields;

        if (!driverCompany || !driverName || !driverID || !packageID) {
          return response.status(400).json({ msg: "All fields are required" });
        }

        const userPackage: any = await shipmentOrderModel.findOne({
          _id: packageID,
        });
        userPackage.assignedDriver = driverName;
        userPackage.status = "Driver Assigned";

        const isDriverExisting = await driverModel.findOne({
          driver_name: driverName,
        });
        if (!isDriverExisting) {
          const newDriver = new driverModel({
            driver_name: driverName,
            driver_id: driverID,
            assignedDeliveries: [packageID],
          });

          const savedDriver = await newDriver.save();

          const twilio__AccountSiD = process.env.twilio__accountSiD;
          const twilio__authToken = process.env.twilio__authToken;
          const client = twilio(twilio__AccountSiD, twilio__authToken);
          const message = `Driver has been assigned to deliver your package, Name:${driverName} from ${driverCompany}`;
          const messageOptions = {
            body: message,
            from: process.env.twilio__number,
            to: process.env.test__number,
          };
          client.messages.create(messageOptions, (error, item) => {
            if (error) {
              return response.status(500).json({
                msg: `Network Error: Failed to Send Sms to ${userPackage.owner_fullName}`,
              });
            }

            const transporter = nodemailer.createTransport({
              service: "SendinBlue",
              auth: {
                user: process.env.sendinBlue__login,
                pass: process.env.sendinBlue__pass,
              },
            });

            const messageOptions = {
              from: "noreply@ElegantDesigns",
              to: userPackage.owner_email,
              subject: "Driver Assign To Deliver Package",
              html: `
  
                      <h1>Order has been assigned a Driver</h1>
                      <h3>Name: ${driverName}</h3>
                      <h4>From; ${driverCompany} Company</h4>
  
                      <h3 style="margin-top:3rem;">Queries?</h3>
                      <h4>Call: 0824566774</h4>
                      <h4>Email: ElegantDesign@gmail.com</h4>
                  
                  `,
            };

            transporter.sendMail(messageOptions, (error, info) => {
              if (error) {
                return response
                  .status(500)
                  .json({ msg: `Failed to send email to` });
              }
            });
          });
        }
      });
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Network Error: Failed to assign driver" });
    }
  }
}
