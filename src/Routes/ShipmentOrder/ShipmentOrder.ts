import { Router } from "express";
import shipmentOrderController from "../../Controller/ShipmentOrder/ShipmentOrder";

const ShipmentOrderController = new shipmentOrderController();
const router = Router();

router.post("/api/create-new-order", (request, response) => {
  ShipmentOrderController.CreateOrder(request, response);
});

router.get("/api/get-all-order", (request, response) => {
  ShipmentOrderController.FetchAllShipemtOrder(request, response);
});

router.post("/api/assign-driver", (request, response) => {
  ShipmentOrderController.AssignDriver(request, response);
});

router.get("/api/fetch-user-orders", (request, response) => {
  ShipmentOrderController.FetchSpecificOrder(request, response);
});
export default router;
