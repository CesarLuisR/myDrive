import type { User } from "../../types/User";

export interface AuthState {
    authenticated: boolean;
    token: string | null;
    user: User | null;
    loading: boolean;
    error: string | null;
};

export const initialState: AuthState = {
    authenticated: false,
    token: null,
    user: null,
    loading: false,
    error: null
};