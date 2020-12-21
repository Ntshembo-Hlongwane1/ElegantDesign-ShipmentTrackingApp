import { Request, Response } from "express";
import { shipmentOrderModel } from "../../Model/ShipmentOrders/ShipmentOrder";
import ShipmentUpdate from "./ShipmentOrderUpdater";

interface ShipmentFetcher {
  FetchAllShipemtOrder(request: Request, response: Response): Promise<Response>;
  FetchSpecificOrder(request: Request, response: Response): Promise<Response>;
}

export default class ShipmentOrderFetcher
  extends ShipmentUpdate
  implements ShipmentFetcher {
  async FetchAllShipemtOrder(request: Request, response: Response) {
    try {
      const data = await shipmentOrderModel.find();

      return response.status(200).json(data);
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Network Error: Failed to fetch all Shipment Orders" });
    }
  }
  async FetchSpecificOrder(request: Request, response: Response) {
    const userSession = request.session.user || false;
    const username = userSession.username;

    try {
      const userOrders = await shipmentOrderModel.find({
        owner_fullName: username,
      });

      return response.status(200).json(userOrders);
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Network Error: Failed to fetch all shipment Orders" });
    }
  }
}
