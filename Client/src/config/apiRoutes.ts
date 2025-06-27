import { config } from "./varConfig";

const API = config.api;

export const apiRoutes = {
    auth: {
        signUp: `${API}/auth/register`,
        logIn: `${API}/auth/login`
    }
};