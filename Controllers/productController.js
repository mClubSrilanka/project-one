import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

// ✅ Create Product
export async function createProduct(req, res) {
	if (!isAdmin(req)) {
		return res.status(403).json({ message: "Access denied, Admins only" });
	}

	// ✅ NEW: Set default subcategory for existing products
	const productData = {
		...req.body,
		subcategory: req.body.subcategory || "Default"
	};

	const product = new Product(productData);

	try {
		const response = await product.save();

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
		res.json(categories);
	} catch (error) {
		console.error("Error fetching categories:", error);
		res.status(500).json({ message: "Failed to fetch categories" });
	}
}

// ✅ Get products by category
export async function getProductsByCategory(req, res) {
	try {
		const categoryName = req.params.categoryName;
		const products = await Product.find({ category: categoryName, isAvailable: true });
		res.json(products);
	} catch (error) {
		console.error("Error fetching products by category:", error);
		res.status(500).json({ message: "Failed to fetch products by category" });
	}
}

// ✅ NEW: Get products by subcategory
export async function getProductsBySubcategory(req, res) {
    try {
        const { categoryName, subcategoryName } = req.params;
        const products = await Product.find({
            category: categoryName,
            subcategory: subcategoryName,
            isAvailable: true
        });
        res.json(products);
    } catch (error) {
        console.error("Error fetching products by subcategory:", error);
        res.status(500).json({ message: "Failed to fetch products by subcategory" });
    }
}

// ✅ NEW: Get unique subcategories for a given category
export async function getSubcategories(req, res) {
    try {
        const categoryName = req.params.categoryName;
        let subcategories = await Product.distinct("subcategory", {
            category: categoryName,
        });

        subcategories = subcategories
            .filter((s) => s && s.trim() !== "")
            .sort((a, b) => a.localeCompare(b));

        res.json(subcategories);
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ message: "Failed to fetch subcategories" });
    }
}
// ✅ Featured products
export async function getFeaturedProducts(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const products = await Product.find({ featured: true, isAvailable: true })
      .limit(limit)
      .sort({ date: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: "Failed to fetch featured products" });
  }
}

// ✅ Top reviewed products
export async function getTopReviewedProducts(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const products = await Product.find({ topReviewed: true, isAvailable: true })
      .limit(limit)
      .sort({ rating: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching top reviewed products:", error);
    res.status(500).json({ message: "Failed to fetch top reviewed products" });
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


// ✅ Delete a product
export async function deleteProduct(req, res) {
	if (!isAdmin(req)) {
		return res.status(403).json({ message: "Access denied, Admins only" });
	}

	try {
		const productId = req.params.productId;
		await Product.deleteOne({ productId });

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.error("Error deleting product", error);
		res.status(500).json({ message: "Failed to delete product" });
	}
}

// ✅ Update a product
export async function updateProduct(req, res) {
	if (!isAdmin(req)) {
		return res.status(403).json({ message: "Access denied, Admins only" });
	}

	try {
		const productId = req.params.productId;
		const updatedProduct = await Product.findOneAndUpdate(
			{ productId },
			req.body,
			{ new: true }
		);

		if (!updatedProduct) {
			return res.status(404).json({ message: "Product not found" });
		}
		res.json({ message: "Product updated successfully", product: updatedProduct });
	} catch (error) {
		console.error("Error updating product", error);
		res.status(500).json({ message: "Failed to update product" });
	}
}
