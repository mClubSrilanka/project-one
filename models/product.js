import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    altNames: { type: [String], default: [] },
    labelledPrice: { type: Number, required: true },
    price: { type: Number, required: true },
    images: { type: [String], default: ["/default-product.jpg"] },
    description: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    isAvailable: { type: Boolean, default: true },
    category: { type: String, required: true, default: "cosmetics" },
    subcategory: { type: String, default: "", required: false },

    // ✅ NEW FIELDS
    featured: { type: Boolean, default: false },
    topReviewed: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

const Product = mongoose.model("products", productSchema);
export default Product;
