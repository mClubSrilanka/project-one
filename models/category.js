import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
});

export default mongoose.model("Category", CategorySchema);
