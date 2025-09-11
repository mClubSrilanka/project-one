import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

// ✅ Create Product
export async function createProduct(req, res) {
	if (!isAdmin(req)) {
		return res.status(403).json({ message: "Access denied, Admins only" });
	}

	const product = new Product(req.body);

	try {
		const response = await product.save();

		// Optional: log category (will be automatically in distinct)
		console.log("Product created with category:", response.category);

		res.json({
			message: "Product created successfully",
			product: response
		});
	} catch (error) {
		console.error("Error creating product", error);
		return res.status(500).json({ message: "Failed to create product" });
	}
}

// ✅ Get all products
export async function getProducts(req, res) {
	try {
		const products = await Product.find();
		res.json(products);
	} catch (error) {
		console.error("Error fetching products", error);
		return res.status(500).json({ message: "Failed to fetch products" });
	}
}

// ✅ Get unique categories
export async function getCategories(req, res) {
	try {
		// Products collection එකෙන් unique category names ගන්න
		let categories = await Product.distinct("category");

		// null / empty values remove කරලා, sort කරන්න
		categories = categories
			.filter((c) => c && c.trim() !== "")
			.sort((a, b) => a.localeCompare(b));

		res.json(categories);
	} catch (error) {
		console.error("Error fetching categories:", error);
		res.status(500).json({ message: "Failed to fetch categories" });
	}
}

// ✅ Delete Product
export async function deleteProduct(req, res) {
	if (!isAdmin(req)) {
		return res.status(403).json({ message: "Access denied. Admins only." });
	}

	try {
		const productId = req.params.productId;
		await Product.deleteOne({ productId });
		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.error("Error deleting product:", error);
		res.status(500).json({ message: "Failed to delete product" });
	}
}

// ✅ Update Product
export async function updateProduct(req, res) {
	if (!isAdmin(req)) {
		return res.status(403).json({ message: "Access denied. Admins only." });
	}

	const data = req.body;
	const productId = req.params.productId;
	data.productId = productId;

	try {
		await Product.updateOne({ productId }, data);
		res.json({ message: "Product updated successfully" });
	} catch (error) {
		console.error("Error updating product:", error);
		res.status(500).json({ message: "Failed to update product" });
	}
}

// ✅ Get product info
export async function getProductInfo(req, res) {
	try {
		const productId = req.params.productId;
		const product = await Product.findOne({ productId });

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (!isAdmin(req) && !product.isAvailable) {
			return res.status(404).json({ message: "Product is not available" });
		}

		res.json(product);
	} catch (error) {
		console.error("Error fetching product info:", error);
		res.status(500).json({ message: "Failed to fetch product info" });
	}
}

// ✅ Search products
export async function searchProducts(req, res) {
	const query = req.params.query;

	try {
		const products = await Product.find({
			$or: [
				{ name: { $regex: query, $options: "i" } },
				{ altNames: { $elemMatch: { $regex: query, $options: "i" } } }
			],
			isAvailable: true
		});
		res.json(products);
	} catch {
		res.status(500).json({ message: "Failed to search products" });
	}
}

// ✅ Get products by category
export async function getProductsByCategory(req, res) {
	try {
		const categoryName = decodeURIComponent(req.params.categoryName);

		const products = await Product.find({
			category: { $regex: `^${categoryName}$`, $options: "i" },
			isAvailable: true
		});

		res.json(products);
	} catch (error) {
		console.error("Error fetching products by category:", error);
		res.status(500).json({ message: "Failed to fetch products by category" });
	}
}