import { pool } from "../database/db";
import { LogInData, SignUpData, User } from "../types/auth";
import { comparePassword, hashPassword } from "../utils/hash";
import * as userQueries from "../models/authModel";
import validator from "validator";
import { generateToken, TokenPayload } from "../utils/token";
import { NotFoundError, UnauthorizedError } from "../utils/error";

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

export const loginUser = async (loginData: LogInData): Promise<{token: string, user: User}> => {
    try {
        const isEmail = validator.isEmail(loginData.identifier);

        const rawBriefUserData = isEmail 
            ? await pool.query(userQueries.getUserByEmail, [loginData.identifier])
            : await pool.query(userQueries.getUserByUsername, [loginData.identifier])
        
        if (rawBriefUserData.rowCount == 0)
            throw new UnauthorizedError( "Invalid credentials");

        const foundUser: FoundUserType = rawBriefUserData.rows[0];

        const isPasswordValid: boolean = await comparePassword(loginData.password, foundUser.hash_password);
        if (!isPasswordValid)
            throw new UnauthorizedError( "Invalid credentials");

        const tokenPayload: TokenPayload = {
            id: foundUser.uuid
        }

        const token = generateToken(tokenPayload);

        const rawCompleteUserData = await pool.query(userQueries.getUserById, [foundUser.uuid]);
        if (rawCompleteUserData.rowCount === 0) 
            throw new NotFoundError("User not found");

        const user: User = rawCompleteUserData.rows[0];

        return { token, user };
    } catch(e) {
        console.error("Error during login:", e);
        throw e;
    }
}

type FoundUserType = {
    hash_password: string,
    uuid: string
}

export const loadUser = async (id: string) => {
    try {
        const data = await pool.query(userQueries.getUserById, [id]);

        if (data.rowCount === 0) 
            throw new NotFoundError("No user found");

        return data.rows[0];
    } catch(e) {
        console.error("Error during loading user service:", e);
        throw e;
    }
}