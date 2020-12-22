import { IncomingForm, Fields } from "formidable";
import { shipmentOrderModel } from "../../Model/ShipmentOrders/ShipmentOrder";
import { Request, Response } from "express";
import { driverModel } from "../../Model/Driver/Driver";
import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";
import axios from "axios";
import { GetTime } from "../../Utils/CurrentTimeFinder/CurrentTime";
dotenv.config();

interface ShipmentUpdater {
  AssignDriver(request: Request, response: Response);
  LeftWareHouse(request: Request, response: Response): Promise<Response>;
  UpdatePackageLocaton(request: Request, response: Response): Promise<Response>;
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

          const updatedUserPackage: any = await shipmentOrderModel.findOneAndUpdate(
            { _id: packageID },
            userPackage,
            { new: true }
          );

          const message = `Order Status: ${updatedUserPackage.status},driver assigned. Current Location:${userPackage.current_location[0]},
          TrackingID:${userPackage.Item_ID}.`;
          const url = `https://jimba.co.za/sms.php?cell=${userPackage.owner_phoneNumber}&message=${message}`;
          const data = await axios.get(url);

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
              msg:
                "Driver has been successfully assigned, Sms and Email was sent to user",
            });
          });
        }

        driver.assignedDeliveries = [driverID, ...driver.assignedDeliveries];
        const userPackage: any = await shipmentOrderModel.findOne({
          _id: packageID,
        });
        userPackage.assignedDriver = driverName;
        userPackage.status = "Awaiting PickUp";

        const updatedUserPackage: any = await shipmentOrderModel.findOneAndUpdate(
          { _id: packageID },
          userPackage,
          { new: true }
        );

        const message = `Order Status: ${updatedUserPackage.status},driver assigned. Current Location:${userPackage.current_location[0]},
          TrackingID:${userPackage.Item_ID}.`;
        const url = `https://jimba.co.za/sms.php?cell=${userPackage.owner_phoneNumber}&message=${message}`;
        const data = await axios.get(url);

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
            msg:
              "Driver has been successfully assigned, Sms and Email was sent to user",
          });
        });
      });
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Network Error: Failed to assign driver" });
    }
  }

  async LeftWareHouse(request: Request, response: Response) {
    const userSession = request.session.user || false;
    const username = userSession.username;
    const packageID = request.params.packageID;
    try {
      const userPackage: any = await shipmentOrderModel.findOne({
        _id: packageID,
      });
      userPackage.status = "Left WareHouse";
      const currentTime = GetTime();
      userPackage.pickupTime = currentTime;

      const updatePackage: any = await shipmentOrderModel.findOneAndUpdate(
        { _id: packageID },
        userPackage,
        { new: true }
      );

      const message = `Order Status: ${updatePackage.status}. Current Location:${userPackage.current_location[0]},
          TrackingID:${userPackage.Item_ID}.`;
      const url = `https://jimba.co.za/sms.php?cell=${userPackage.owner_phoneNumber}&message=${message}`;
      const data = await axios.get(url);

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
          msg:
            "Status has been successfully updated, Sms and Email was sent to user",
        });
      });
    } catch (error) {
      return response.status(500).json({
        msg: "Network Error: Failed to change status to Left Warehouse",
      });
    }
  }

  async UpdatePackageLocaton(request: Request, response: Response) {
    const userSession = request.session.user || false;
    const username = userSession.username;
    const packageID = request.params.packageID;
    const location = request.params.location;
    try {
      if (userSession) {
        const userPackage: any = await shipmentOrderModel.findOne({
          _id: packageID,
        });

        userPackage.current_location = [
          location,
          ...userPackage.current_location,
        ];

        const updatedUserPackage: any = await shipmentOrderModel.findOneAndUpdate(
          { _id: packageID },
          userPackage,
          { new: true }
        );

        const message = `Order Status: ${updatedUserPackage.status}. Current Location:${updatedUserPackage.current_location[0]},
        TrackingID:${userPackage.Item_ID}.`;
        const url = `https://jimba.co.za/sms.php?cell=${userPackage.owner_phoneNumber}&message=${message}`;
        const data = await axios.get(url);

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
            msg:
              "Location has been successfully updated, Sms and Email was sent to user",
          });
        });
      }
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Network Error: Failed to update package location" });
    }
  }
}
