import Product from "./src/models/Product.js";
import Category from "./src/models/Category.js";
import User from "./src/models/User.js";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
dotenv.config();

connectDB();
const products = await Product.find()
    .populate("id_category")
    .populate("id_jeweler");

console.log(products[0]);