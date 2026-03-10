import express, { Router } from "express";


const router = express.Router();


router.post("/cart", async (req, res,next) => {
  res.status(201).json({ message: "Cart created" });
});


router.get("/carts", async (req, res,next) => {
  res.status(200).json({ message: "Carts retrieved" });
});


router.patch("/cart/:id", async (req, res,next) => {
  res.status(200).json({ message: "Cart updated" });
});

router.delete("/cart/:id", async (req, res,next) => {
  res.status(200).json({ message: "Cart deleted" });
});

export default router;