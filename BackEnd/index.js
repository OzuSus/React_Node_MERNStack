import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import cors from "cors"
import authRoutes from "./src/routes/auth.js"
import {errorHandler} from "./src/middlewares/errorHandlerMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
