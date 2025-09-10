import express from "express";
import Product from "../models/product.js";

import {
	createProduct,
	deleteProduct,
	getProductInfo,
	getProducts,
	searchProducts,
	updateProduct,
	getProductsByCategory,
	getCategories,
} from "../Controllers/productController.js";

const productRouter = express.Router();

// ✅ Get products by category (keep this above /:productId)
productRouter.get("/category/:categoryName", getProductsByCategory);

// ✅ Get all unique categories (use controller function)
productRouter.get("/categories", getCategories);

// ✅ CRUD routes
productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.get("/search/:query", searchProducts);
productRouter.get("/:productId", getProductInfo);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct);

export default productRouter;