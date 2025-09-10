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
} from "../Controllers/productController.js";

const productRouter = express.Router();

// ✅ Get products by category (keep this above /:productId)
productRouter.get("/category/:categoryName", getProductsByCategory);

// ✅ NEW: Get all unique categories
productRouter.get("/categories", async (req, res) => {
	try {
		const categories = await Product.distinct("category"); // import Product if needed
		res.json(categories);
	} catch (error) {
		console.error("Error fetching categories:", error);
		res.status(500).json({ message: "Failed to fetch categories" });
	}
});

productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.get("/search/:query", searchProducts);
productRouter.get("/:productId", getProductInfo);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct);

export default productRouter;
