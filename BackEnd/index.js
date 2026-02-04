import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
