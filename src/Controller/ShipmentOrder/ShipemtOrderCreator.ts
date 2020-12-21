import { IncomingForm, Fields } from "formidable";
import twilio from "twilio";
import nodemailer from "nodemailer";
import { shipmentOrderModel } from "../../Model/ShipmentOrders/ShipmentOrder";
import { Request, Response } from "express";
import dotenv from "dotenv";
import ShipmentOrderFetcher from "./ShipmentOrderFetcher";
import { userModel } from "../../Model/Users/Users";
import Bcrypt from "bcrypt";
import axios from "axios";
import { passwordGenerator } from "../../Utils/Generators/PasswordGen";

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
      form.parse(request, async (error, fields: Fields) => {
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

        const savedOrder: any = await newOrder.save();
        /*
         * Endpoint --> https://jimba.co.za/sms.php?cell=0731820631&message=Tesing%20the%20app
         */
        if (savedOrder) {
          const current_location = savedOrder.current_location[0];
          const message = `Order Status: Approved, awaiting driver to be assigned. Current Location:${current_location},
          TrackingID:${Item_ID}. Check Email for login details`;
          const url = `https://jimba.co.za/sms.php?cell=${owner_phoneNumber}&message=${message}`;
          const data = await axios.get(url);

          const user = await userModel.findOne({ username: owner_fullName });

          if (user) {
            return response.status(400).json({
              msg:
                "Account with this username already exist give user another username",
            });
          }

          const salt = await Bcrypt.genSalt(15);
          const password = passwordGenerator(15);
          const hashedPassword = await Bcrypt.hash(password, salt);

          const newUser = new userModel({
            username: owner_fullName,
            email: owner_email,
            password: hashedPassword,
            role: "Customer",
          });

          const savedUser = await newUser.save();
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
              msg:
                "Shipment Order has been successfully created, Sms and Email has been sent",
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
