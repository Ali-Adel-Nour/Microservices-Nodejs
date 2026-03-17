import express from "express";
import { OrderService } from "../services/order.service";
import { OrderRepository } from "../repository/order.repository";
import { Order } from "../models/order.model";

const router = express.Router();
export const orderService = new OrderService(OrderRepository);

router.post("/order", async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body as Order);
    return res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

router.get("/orders", async (req, res, next) => {
  try {
    const userId = parseInt(req.query.userId as string);
    const orders = await orderService.getOrders(userId);
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

router.get("/order/:id", async (req, res, next) => {
  try {
    const order = await orderService.getOrder(parseInt(req.params.id as string));
    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

router.patch("/order/:id", async (req, res, next) => {
  try {
    const order = await orderService.updateOrder({
      ...req.body,
      id: parseInt(req.params.id as string),
    } as Order);
    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

router.delete("/order/:id", async (req, res, next) => {
  try {
    await orderService.deleteOrder(parseInt(req.params.id as string));
    return res.status(200).json({});
  } catch (error) {
    next(error);
  }
});

export default router;