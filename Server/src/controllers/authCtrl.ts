import { RequestHandler } from "express";
import { LogInData, SignUpData } from "../types/auth";
import { loadUser, loginUser, registerUser } from "../services/authService";
import config from "../config"
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/error";

export const signUp: RequestHandler = async (req, res, next) => {
    try {
        const data: SignUpData = req.body;
        if (!data.email || !data.lastname || !data.name || !data.password)
            throw new BadRequestError("All data is required");

        if (typeof data.password != "string" || data.password.length > 30)
            throw new BadRequestError("Password format error");

        await registerUser(data);

        res.status(201).json({ message: "User created successfully" });
    } catch(e: any) {
        next(e);
    }
}

export const logIn: RequestHandler = async (req, res, next) => {
    try {
        const data: LogInData = req.body;
        if (!data.identifier || !data.password) 
            throw new BadRequestError("All data is required");

        if (typeof data.password != "string" || data.password.length > 30)
            throw new BadRequestError("Password format error");

        if (typeof data.identifier != "string" || data.identifier.length > 30)
            throw new BadRequestError("Identifier format error");

        const { token, user } = await loginUser(data);

        res
            .cookie("token", token, {
                httpOnly: true,
                secure: config.ENV === "production", 
                sameSite: "lax",
                maxAge: 30 * 60 * 1000, // 30 minutos
            })
            .status(201)
            .json({ message: "User logged successfully", user });
    } catch(e: any) {
        next(e);
    }
}

export const load: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user?.id) 
            throw new NotFoundError("User not found");

        const user = await loadUser(req.user?.id);

        res.status(200).json({ user })
    } catch(e: any) {
        next(e);
    }
}