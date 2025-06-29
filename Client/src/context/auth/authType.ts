import type { User } from "../../types/User";

export interface AuthState {
    authenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
};

export const initialState: AuthState = {
    authenticated: false,
    user: null,
    loading: false,
    error: null
};