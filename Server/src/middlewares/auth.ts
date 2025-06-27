import { RequestHandler } from "express";
import { verifyToken } from "../utils/token";

export const authenticateToken: RequestHandler = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        res.status(401).json({ message: "Denied access. No token provided"});
        return;
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch(e) {
        console.error("Error verifying token");
        res.status(403).json({ message: "Expired or invalid token"});
    }
}