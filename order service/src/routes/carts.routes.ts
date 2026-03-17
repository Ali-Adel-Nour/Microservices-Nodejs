import express from "express";
import { CartService } from "../services/cart.service";
import { CartRepository } from "../repository/cart.repository";
import { Cart } from "../models/cart.model";
import { CartRequestDto, CartEditRequestDto } from "../dto/cartRequest.dto";
import { validateRequest } from "../utils/validators";

const router = express.Router();
export const cartService = new CartService(CartRepository);

router.post("/cart", validateRequest(CartRequestDto), async (req, res, next) => {
  try {
    const cart = await cartService.createCart(req.body as Cart);
    return res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
});

router.get("/carts", async (req, res, next) => {
  try {
    const userId = parseInt(req.query.userId as string);
    const cart = await cartService.getCart(userId);
    return res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

router.patch("/cart/:id", validateRequest(CartEditRequestDto), async (req, res, next) => {
  try {
    const cart = await cartService.updateCart({
      ...req.body,
      id: parseInt(req.params.id as string),
    } as Cart);
    return res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

router.delete("/cart/:id", async (req, res, next) => {
  try {
    await cartService.deleteCart(parseInt(req.params.id as string));
    return res.status(200).json({});
  } catch (error) {
    next(error);
  }
});

export default router;