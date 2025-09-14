import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to DB for sample insert"))
    .catch(err => console.error("❌ DB connection error:", err));

const sampleProducts = [
    {
        productId: "P001",
        name: "Organic Coconut Oil",
        altNames: ["Coconut Oil", "Hair Oil"],
        labelledPrice: 1200,
        price: 1000,
        images: ["/coconut-oil.jpg"],
        description: "100% pure organic coconut oil",
        stock: 50,
        category: "Health",
        subcategory: "Oils",
        featured: true,
        topReviewed: true,
        rating: 4.7
    },
    {
        productId: "P002",
        name: "Herbal Shampoo",
        altNames: ["Shampoo", "Hair Care"],
        labelledPrice: 800,
        price: 650,
        images: ["/shampoo.jpg"],
        description: "Herbal shampoo for healthy hair",
        stock: 30,
        category: "Health",
        subcategory: "Hair Care",
        featured: true,
        topReviewed: false,
        rating: 4.2
    },
    {
        productId: "P003",
        name: "Organic Honey",
        altNames: ["Honey", "Natural Honey"],
        labelledPrice: 1500,
        price: 1200,
        images: ["/honey.jpg"],
        description: "Pure organic honey from local farms",
        stock: 40,
        category: "Food",
        subcategory: "Sweeteners",
        featured: false,
        topReviewed: true,
        rating: 4.8
    }
];

async function insertSamples() {
    try {
        await Product.insertMany(sampleProducts);
        console.log("✅ Sample products inserted");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error inserting sample products:", err);
    }
}

insertSamples();
