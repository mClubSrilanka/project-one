import Product from "../models/product.js";

export async function getCategories(req, res) {
	try {
		const categories = await Product.distinct("category");
		res.status(200).json(categories);
	} catch (err) {
		console.error("Error fetching categories:", err.message);
		res.status(500).json({ error: "Failed to fetch categories" });
	}
}
