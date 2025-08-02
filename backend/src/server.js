import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import { connectDB } from "./config/mongodb.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json()); // allows us to parse incoming requests: req.body
app.use(cookieParser()); // allows us to parse incoming cookies
app.use("/api/auth", authRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(
            `\nServer is running on port ${PORT}\nhttp://localhost:${PORT}`
        );
    });
});
