import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import cors from "cors"
import authRoutes from "./src/routes/auth.js"
import userRoutes from "./src/routes/user.js"
import {errorHandler} from "./src/middlewares/errorHandlerMiddleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => res.send("API running"));

app.use(errorHandler);


const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
