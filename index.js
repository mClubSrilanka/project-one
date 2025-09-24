// server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

// Routers
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";

// Middlewares
import { verifyToken } from "./middlewares/auth.js";

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// ✅ JWT middleware
app.use(verifyToken);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to database"))
  .catch(() => console.log("Failed to connect to database"));

// Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

// Start server
app.listen(5000, () => console.log("Server started on port 5000"));
