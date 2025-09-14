import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js"; // ✅ keep to clear cart
import { isAdmin } from "./userController.js";

// Create order (unchanged)
export async function createOrder(req, res) {
	try {
		if (req.user == null) {
			res.status(401).json({ message: "Please login to create an order" });
			return;
		}

		const latestOrder = await Order.find().sort({ date: -1 }).limit(1);
		let orderId = "MOL000001";
		if (latestOrder.length > 0) {
			const lastOrderIdInString = latestOrder[0].orderID;
			const lastOrderIdWithoutPrefix = lastOrderIdInString.replace("MOL", "");
			const lastOrderIdInInteger = parseInt(lastOrderIdWithoutPrefix);
			const newOrderIdInInteger = lastOrderIdInInteger + 1;
			const newOrderIdWithoutPrefix = newOrderIdInInteger
				.toString()
				.padStart(6, "0");
			orderId = "MOL" + newOrderIdWithoutPrefix;
		}

		const items = [];
		let total = 0;

		if (req.body.items !== null && Array.isArray(req.body.items)) {
			for (let i = 0; i < req.body.items.length; i++) {
				let item = req.body.items[i];
				let product = await Product.findOne({ productId: item.productId });
				if (product == null) {
					res.status(400).json({ message: "Invalid product ID: " + item.productId });
					return;
				}

				items[i] = {
					productId: product.productId,
					name: product.name,
					image: product.images[0],
					price: product.price,
					qty: item.qty,
				};

				total += product.price * item.qty;
			}
		} else {
			res.status(400).json({ message: "Invalid items format" });
			return;
		}

		const order = new Order({
			orderID: orderId,
			email: req.user.email,
			name: req.user.firstName + " " + req.user.lastName,
			address: req.body.address,
			phone: req.body.phone,
			items: items,
			total: total,
		});

		const result = await order.save();

		// Clear user's cart
		await User.findByIdAndUpdate(req.user._id, { cart: [] });

		// Return orderId separately
		res.json({
			message: "Order created successfully",
			orderId: result.orderID,
			result: result,
		});
	} catch (error) {
		console.error("Error creating order:", error);
		res.status(500).json({ message: "Failed to create order" });
	}
}

// Get orders with optional filtering (minimal change)
export async function getOrders(req, res) {
	const page = parseInt(req.params.page) || 1;
	const limit = parseInt(req.params.limit) || 10;
	const { status, orderID, startDate, endDate } = req.query; // new filters

	if (req.user == null) {
		res.status(401).json({ message: "Please login to view orders" });
		return;
	}

	try {
		let query = {};
		if (req.user.role !== "admin") {
			query.email = req.user.email;
		}
		if (status) query.status = status;
		if (orderID) query.orderID = orderID;
		if (startDate || endDate) {
			query.date = {};
			if (startDate) query.date.$gte = new Date(startDate);
			if (endDate) query.date.$lte = new Date(endDate);
		}

		const orderCount = await Order.countDocuments(query);
		const totalPages = Math.ceil(orderCount / limit);
		const orders = await Order.find(query)
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ date: -1 });

		res.json({
			orders: orders,
			totalPages: totalPages,
		});
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).json({ message: "Failed to fetch orders" });
	}
}

// Update order (unchanged)
export function updateOrder(req, res) {
	if (isAdmin(req)) {
		const orderId = req.params.orderId;
		const status = req.body.status;
		const notes = req.body.notes;

		Order.findOneAndUpdate(
			{ orderID: orderId },
			{ status: status, notes: notes },
			{ new: true }
		)
			.then((updatedOrder) => {
				if (updatedOrder) {
					res.json({
						message: "Order updated successfully",
						order: updatedOrder,
					});
				} else {
					res.status(404).json({ message: "Order not found" });
				}
			})
			.catch((error) => {
				console.error("Error updating order:", error);
				res.status(500).json({ message: "Failed to update order" });
			});
	} else {
		res.status(403).json({
			message: "You are not authorized to update orders",
		});
	}
}

// ✅ Repeat order (new minimal endpoint)
export async function repeatOrder(req, res) {
	if (!req.user) return res.status(401).json({ message: "Please login" });

	const { orderID } = req.params;
	const order = await Order.findOne({ orderID });
	if (!order) return res.status(404).json({ message: "Order not found" });

	const cartItems = order.items.map((item) => ({
		productId: item.productId,
		qty: item.qty,
		name: item.name,
		image: item.image,
		price: item.price,
	}));

	// Update user's cart
	await User.findByIdAndUpdate(req.user._id, { cart: cartItems });

	res.json({ message: "Order added to cart for repeat", cart: cartItems });
}
