import jwt from "jsonwebtoken";
import config from "../config";

export interface TokenPayload {
    id: string;
}

const JWT_SECRET = config.jwtSecret;

export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '30m' });
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
}