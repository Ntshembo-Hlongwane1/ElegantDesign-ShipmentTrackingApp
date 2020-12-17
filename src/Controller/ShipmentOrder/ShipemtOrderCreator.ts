import { IncomingForm, Fields } from "formidable";
import twilio from "twilio";
import nodemailer from "nodemailer";
import { shipmentOrderModel } from "../../Model/ShipmentOrders/ShipmentOrder";
import { Request, Response } from "express";
import dotenv from "dotenv";
import ShipmentOrderFetcher from "./ShipmentOrderFetcher";

dotenv.config();

interface OrderCreator {
  CreateOrder(request: Request, response: Response): Response;
}

export default class ShipmentOrderController
  extends ShipmentOrderFetcher
  implements OrderCreator {
  CreateOrder(request: Request, response: Response) {
    const form = new IncomingForm();

    try {
      form.parse(request, async (error, fields, files) => {
        if (error) {
          return response
            .status(500)
            .json({ msg: "Network Error: Failed to create shipment order" });
        }
        const {
          owner_fullName,
          owner_email,
          owner_phoneNumber,
          Item_name,
          Item_weight,
          Item_primaryLocation,
          Item_destination,
          Item_ID,
        } = fields;

        if (
          !owner_email ||
          !owner_fullName ||
          !owner_phoneNumber ||
          !Item_ID ||
          !Item_destination ||
          !Item_name ||
          !Item_primaryLocation ||
          !Item_weight
        ) {
          return response.status(500).json({ msg: "All fields are required" });
        }

        const isOrderExisting: any = await shipmentOrderModel.findOne({
          Item_ID: Item_ID,
        });

        if (isOrderExisting) {
          return response.status(400).json({
            msg: `Order with this ID is already active with the status of ${isOrderExisting.status}`,
          });
        }

        const newOrder = new shipmentOrderModel({
          owner_fullName,
          owner_email,
          owner_phoneNumber,
          Item_name,
          Item_weight,
          Item_primaryLocation,
          Item_destination,
          Item_ID,
        });

        const savedOrder = await newOrder.save();

        if (savedOrder) {
          const twilio__AccountSiD = process.env.twilio__accountSiD;
          const twilio__authToken = process.env.twilio__authToken;
          const client = twilio(twilio__AccountSiD, twilio__authToken);
          const message = `Your Shipment order been processed and Approved awaiting pickup to deliver package, to track order TrackingID: ${Item_ID}`;

          const messageOptions = {
            body: message,
            from: process.env.twilio__number,
            to: process.env.test__number,
          };
          client.messages.create(messageOptions, (error, item) => {
            if (error) {
              return response.status(500).json({
                msg: `Network Error: Failed to send ${owner_fullName} an sms`,
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
              to: owner_email,
              subject: "Approved Shipment Order",
              html: `

                    <h1>Shipment Order Approved</h1>
                    <h3>Waiting for pickup to deliver your package</h3>
                    <h4>Shipment TrackingID: ${Item_ID}</h4>

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
                msg:
                  "Shipment Order has been successfully created, Sms and Email has been sent",
              });
            });
          });
        }
      });
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Network Error: Failed to create shipment order" });
    }
  }
}
