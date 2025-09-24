// routers/productRouter.js
import express from 'express';
import Product from '../models/product.js';
import { verifyToken } from "../middlewares/auth.js";

const productRouter = express.Router();

// CREATE PRODUCT (private)
productRouter.post("/", verifyToken, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error creating product:", err.message);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// GET ALL PRODUCTS (public)
productRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET PRODUCTS BY CATEGORY (public)
productRouter.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.status(200).json(products);
  } catch (err) {
    console.error("Failed to fetch products by category:", err.message);
    res.status(500).json({ error: "Failed to fetch products by category" });
  }
});

// GET ALL CATEGORIES (public)
productRouter.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err.message);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// SEARCH PRODUCTS (public) → now supports category filter
productRouter.get("/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    const category = req.query.category || null;

    const filter = { name: { $regex: query, $options: "i" } };
    if (category && category !== "All") filter.category = category;

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (err) {
    console.error("Failed to search products:", err.message);
    res.status(500).json({ error: "Failed to search products" });
  }
});

// GET SINGLE PRODUCT
productRouter.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// UPDATE PRODUCT (private)
productRouter.put("/:productId", verifyToken, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE PRODUCT (private)
productRouter.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default productRouter;
