import express from "express";
import {
	createProduct,
	deleteProduct,
	getProductInfo,
	getProducts,
	searchProducts,
	updateProduct,
	getProductsByCategory, // ✅ newly added
} from "../Controllers/productController.js";

const productRouter = express.Router();

// ✅ Order matters: keep this above /:productId
productRouter.get("/category/:categoryName", getProductsByCategory);

productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.get("/search/:query", searchProducts);
productRouter.get("/:productId", getProductInfo);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct);

export default productRouter;
