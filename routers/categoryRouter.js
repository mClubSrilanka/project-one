import express from "express";

const router = express.Router();

const categories = [
  {
    name: "Grains",
    subcategories: ["Rice", "Wheat", "Other"]
  },
  {
    name: "Kitchen Ingrediants",
    subcategories: ["Spices", "Oil", "Salt"]
  },
  {
    name: "Fresh",
    subcategories: ["Vegetables", "Fruits"]
  },
  {
    name: "House Hold",
    subcategories: ["Cleaning", "Utensils"]
  },
  {
    name: "Liqur",
    subcategories: ["Beer", "Wine", "Whisky"]
  },
  {
    name: "Farm Fresh",
    subcategories: ["Milk", "Eggs"]
  },
  {
    name: "Personnel Care",
    subcategories: ["Soaps", "Shampoo"]
  },
  {
    name: "Bevereges",
    subcategories: ["Tea", "Coffee", "Juice"]
  },
  {
    name: "Proccesed Foods",
    subcategories: ["Snacks", "Biscuits"]
  }
];

router.get("/", (req, res) => {
  res.json(categories);
});

export default router;
