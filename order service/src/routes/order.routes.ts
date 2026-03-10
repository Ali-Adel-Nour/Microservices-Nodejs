import express, { Router } from "express";


const router = express.Router();


router.post("/order", async (req, res,next) => {
  res.status(201).json({ message: "Order created" });
});


router.get("/orders", async (req, res,next) => {
  res.status(200).json({ message: "Orders retrieved" });
});


router.get("/order/:id", async (req, res,next) => {
  res.status(200).json({ message: "Order retrieved" });
});


router.patch("/order/:id", async (req, res,next) => {
  res.status(200).json({ message: "Order updated" });
});

router.delete("/order/:id", async (req, res,next) => {
  res.status(200).json({ message: "Order deleted" });
});

export default router;