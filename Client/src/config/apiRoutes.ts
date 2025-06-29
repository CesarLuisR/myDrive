import { config } from "./varConfig";

const API = config.api;

export const apiRoutes = {
    auth: {
        signUp: `${API}/auth/signup`,
        logIn: `${API}/auth/login`,
        loadUser: `${API}/auth/load`
    }
};