import { RequestHandler } from "express";
import { LogInData, SignUpData } from "../types/auth";
import { loginUser, registerUser } from "../services/authService";

export const signUp: RequestHandler = async (req, res) => {
    try {
        const data: SignUpData = req.body;
        if (!data.email || !data.lastname || !data.name || !data.password) {
            res.status(400).json({ message: "All data is required" });
            return;
        }

        if (typeof data.password != "string" || data.password.length > 30)  {
            throw new Error("Password format error");
        }

        await registerUser(data);

        res.status(201).json({ message: "User created successfully" });
    } catch(e: any) {
        console.error("Error in signUp controller:", e);

        res.status(500).json({ message: e.message });
    }
}

export const logIn: RequestHandler = async (req, res) => {
    try {
        const data: LogInData = req.body;
        if (!data.identifier || !data.password) {
            res.status(400).json({ message: "All data is required" });
            return;
        }

        if (typeof data.password != "string" || data.password.length > 30)
            throw new Error("Password format error");

        if (typeof data.identifier != "string" || data.identifier.length > 30)
            throw new Error("Identifier format error");

        const token = await loginUser(data);

        res.status(201).json({ message: "User logged successfully", token });
    } catch(e: any) {
        console.error("Error in login controller:", e);

        res.status(500).json({ message: e.message });
    }
}