import express from "express";

const router = express.Router();

// This could later come from a DB instead of a hardcoded array
const categories = [
  "Grains",
  "Kitchen Ingrediants",
  "Fresh",
  "House Hold",
  "Liqur",
  "Farm Fresh",
  "Personnel Care",
  "Bevereges",
  "Proccesed Foods"
];

router.get("/", (req, res) => {
  res.json(categories);
});

export default router;
