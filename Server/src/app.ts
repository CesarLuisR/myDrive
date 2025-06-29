import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser"
import config from "./config";

import authRoutes from "./routes/authRoutes";
import nodeRoutes from "./routes/nodeRoutes";
import { authenticateToken } from "./middlewares/auth";

const app = express();

// config
app.set("port", config.port);

// middlewares
app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin: config.origin, 
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/nodes", authenticateToken, nodeRoutes);

export default app;