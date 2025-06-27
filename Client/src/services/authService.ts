import axios from "axios"
import { apiRoutes } from "../config/apiRoutes"

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

export const registerUser = async (data: SignUpData): Promise<boolean> => {
    try {
        await axios.post(apiRoutes.auth.signUp, data);
        return true;
    } catch(e) {
        console.error(e);
        return false;
    }
}