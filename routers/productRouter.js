import express from "express";
import {
  createProduct, deleteProduct, getProductInfo, getProducts, searchProducts, updateProduct,
  getProductsByCategory, getCategories, getProductsBySubcategory, getSubcategories,
  getFeaturedProducts, getTopReviewedProducts
} from "../Controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/category/:categoryName/:subcategoryName", getProductsBySubcategory);
productRouter.get("/category/:categoryName", getProductsByCategory);
productRouter.get("/categories", getCategories);
productRouter.get("/categories/:categoryName", getSubcategories);
productRouter.get("/featured", getFeaturedProducts);
productRouter.get("/top-reviewed", getTopReviewedProducts);

productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.get("/search/:query", searchProducts);
productRouter.get("/:productId", getProductInfo);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct);

export default productRouter;
