import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routers/productRouter.js";
import dotenv from "dotenv";
import cors from "cors";
import orderRouter from "./routers/orderRouter.js";

// ✅ Remove the import for the old category router
// import categoryRouter from "./routers/categoryRouter.js"; 

dotenv.config();

const app = express();

app.use(bodyParser.json());

// For now: allow all CORS (can restrict later)
app.use(cors());

// ✅ Middleware to decode JWT, if present
app.use((req, res, next) => {
    const value = req.header("Authorization");
    if (value != null) {
        const token = value.replace("Bearer ", "");
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (decoded == null) {
                res.status(403).json({ message: "Unauthorized" });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        next();
    }
});

// ✅ Connect to MongoDB
const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString)
    .then(() => console.log("✅ Connected to database"))
    .catch((error) => console.error("❌ DB Error:", error.message));

// ✅ Mount your API routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter); // ✅ This now handles both products and categories
app.use("/api/orders", orderRouter);

// ✅ Remove the old, incorrect category route
// app.use("/api/categories", categoryRouter); 

// ✅ Start server
app.listen(5000, () => {
    console.log("🚀 Server started on port 5000");
});