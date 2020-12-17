import { Request, Response } from "express";
import { shipmentOrderModel } from "../../Model/ShipmentOrders/ShipmentOrder";

interface ShipmentFetcher {
  FetchAllShipemtOrder(
    request: Request,
    response: Response
  ): Promise<Response<any>>;
}

export default class ShipmentOrderFetcher implements ShipmentFetcher {
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
}
