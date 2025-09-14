import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routers/productRouter.js";
import dotenv from "dotenv";
import cors from "cors";
import orderRouter from "./routers/orderRouter.js";

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    const value = req.header("Authorization");
    if (value) {
        const token = value.replace("Bearer ", "");
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (decoded == null) res.status(403).json({ message: "Unauthorized" });
            else { req.user = decoded; next(); }
        });
    } else next();
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to database"))
    .catch((error) => console.error("❌ DB Error:", error.message));

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

app.listen(5000, () => console.log("🚀 Server started on port 5000"));
