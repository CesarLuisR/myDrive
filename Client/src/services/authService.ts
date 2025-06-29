import axios from "axios"
import { apiRoutes } from "../config/apiRoutes"
import type { User } from "../types/User";

export interface SignUpData {
    name: string,
    lastname: string,
    email: string, 
    password: string
}

export interface LogInData {
    identifier: string;
    password: string;
}

export const registerUserService = async (data: SignUpData): Promise<boolean> => {
    try {
        await axios.post(apiRoutes.auth.signUp, data);
        return true;
    } catch(e) {
        console.error(e);
        throw e;
    }
}

interface LoginResponse {
    user: User
    error: boolean
}

export const loginUserService = async (data: LogInData): Promise<LoginResponse> => {
    try {
        const res = await axios.post(
            apiRoutes.auth.logIn,
            data, 
            { withCredentials: true }
        );
        return { user: res.data.user, error: false };
    } catch(e) {
        console.error(e);
        throw e;
    }
}

export const loadUserService = async (): Promise<{user: User, error: boolean}> => {
    try {
        const res = await axios.post(
            apiRoutes.auth.loadUser,
            {},
            { withCredentials: true }
        );
        return { user: res.data.user, error: false };
    } catch(e) {
        console.error(e);
        throw e;
    }
}