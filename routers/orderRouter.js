import express from "express";
import { createOrder, getOrders, updateOrder, repeatOrder } from "../Controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrders); // filtering via query params
orderRouter.put("/:orderId", updateOrder);
orderRouter.post("/repeat/:orderId", repeatOrder); // repeat order endpoint

export default orderRouter;
