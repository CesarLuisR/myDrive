import { pool } from "../database/db";
import { LogInData, SignUpData } from "../types/auth";
import { comparePassword, hashPassword } from "../utils/hash";
import * as userQueries from "../models/authModel";
import validator from "validator";
import { generateToken, TokenPayload } from "../utils/token";

export const registerUser = async (data: SignUpData) => {
    try {
        const hash = await hashPassword(data.password);

        await pool.query(
            userQueries.createUser, 
            [data.name, data.lastname, data.email, hash]
        );
    } catch(e) {
        console.error("Error in registerUser service:", e);
        throw e;
    }
}

export const loginUser = async (loginData: LogInData): Promise<string> => {
    try {
        const isEmail = validator.isEmail(loginData.identifier);

        const rawUserData = isEmail 
            ? await pool.query(userQueries.getUserByEmail, [loginData.identifier])
            : await pool.query(userQueries.getUserByUsername, [loginData.identifier])
        
        if (rawUserData.rowCount == 0) {
            throw new Error( "Invalid credentials");
        }

        const foundUser: FoundUserType = rawUserData.rows[0];

        const isPasswordValid: boolean = await comparePassword(loginData.password, foundUser.hash_password);
        if (!isPasswordValid) {
            throw new Error( "Invalid credentials");
        }

        const tokenPayload: TokenPayload = {
            id: foundUser.uuid
        }

        const token = generateToken(tokenPayload);
        return token;
    } catch(e) {
        console.error("Error during login:", e);
        throw e;
    }
}

type FoundUserType = {
    hash_password: string,
    uuid: string
}