import express from 'express';
import { createOrder, getOrders, updateOrder } from '../Controllers/orderController.js';

const orderRouter = express.Router();
orderRouter.post("/", createOrder)
orderRouter.get("/:page/:limit", getOrders)
orderRouter.put("/:orderId", updateOrder) // Assuming you want to update an order with the same function

export default orderRouter;