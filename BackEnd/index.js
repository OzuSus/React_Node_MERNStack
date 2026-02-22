import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import cors from "cors"
import authRoutes from "./src/routes/auth.js"
import userRoutes from "./src/routes/user.js"
import productRoutes from "./src/routes/product.js"
import categoryRoutes from "./src/routes/category.js"
import {errorHandler} from "./src/middlewares/errorHandlerMiddleware.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import product from "./src/models/Product.js";

dotenv.config();

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/categorys", categoryRoutes);


app.get("/", (req, res) => res.send("API running"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
