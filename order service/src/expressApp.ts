import express, { Router } from "express";
import cors from "cors";
import cartRoutes from "./routes/carts.routes";
import orderRoutes from "./routes/order.routes";
import { requestLogger } from "./utils/requestLogger";


const app = express();
app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(cartRoutes);
app.use(orderRoutes);

app.use("/", (req, res) => {
  res.send("Order Service is running");
});


export default app;
