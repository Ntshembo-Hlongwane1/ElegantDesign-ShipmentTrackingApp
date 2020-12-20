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

export default class ShipmentUpdate implements ShipmentUpdater {
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

        const driver: any = await driverModel.findOne({
          driver_name: driverName,
        });
        if (!driver) {
          const newDriver = new driverModel({
            driver_name: driverName,
            driver_id: driverID,
            assignedDeliveries: driverID,
          });
          const savedDriver = await newDriver.save();
          const userPackage: any = await shipmentOrderModel.findOne({
            _id: packageID,
          });
          userPackage.assignedDriver = driverName;
          userPackage.status = "Awaiting PickUp";

          const updatedUserPackage = await shipmentOrderModel.findOneAndUpdate(
            { _id: packageID },
            userPackage,
            { new: true }
          );
          const twilio__AccountSiD = process.env.twilio__accountSiD;
          const twilio__authToken = process.env.twilio__authToken;
          const client = twilio(twilio__AccountSiD, twilio__authToken);
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

            const transporter = nodemailer.createTransport({
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
                msg:
                  "Driver has been successfully assigned, Sms and Email was sent to user",
              });
            });
          });
        }

        driver.assignedDeliveries = [driverID, ...driver.assignedDeliveries];
        const userPackage: any = await shipmentOrderModel.findOne({
          _id: packageID,
        });
        userPackage.assignedDriver = driverName;
        userPackage.status = "Awaiting PickUp";

        const updatedUserPackage = await shipmentOrderModel.findOneAndUpdate(
          { _id: packageID },
          userPackage,
          { new: true }
        );

        const twilio__AccountSiD = process.env.twilio__accountSiD;
        const twilio__authToken = process.env.twilio__authToken;
        const client = twilio(twilio__AccountSiD, twilio__authToken);
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

          const transporter = nodemailer.createTransport({
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
              msg:
                "Driver has been successfully assigned, Sms and Email was sent to user",
            });
          });
        });
      });
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Network Error: Failed to assign driver" });
    }
  }
}
