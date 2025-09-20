import express from 'express';
import { createProduct, deleteProduct, getProductInfo, getProducts, searchProducts, updateProduct } from '../Controllers/productController.js';

import { getCategories } from '../Controllers/categoryController.js';

const productRouter = express.Router();
productRouter.post("/",createProduct)
productRouter.get("/",getProducts)
productRouter.get("/:productId", getProductInfo) 
productRouter.delete("/:productId", deleteProduct)
productRouter.put("/:productId", updateProduct)
productRouter.get("/search/:query", searchProducts)
productRouter.get("/categories", getCategories);

export default productRouter;
