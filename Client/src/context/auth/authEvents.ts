import type { PayloadAction } from "@reduxjs/toolkit"
import { initialState, type AuthState } from "./authType";
import type { User } from "../../types/User";

export const setCredentials = (
    state: AuthState, 
    action: PayloadAction<{user: User, token: string}>
) => {
    state.user = action.payload.user
    state.token = action.payload.token
    state.authenticated = true
    state.loading = false
    state.error = null
};

export const clearCredentials = (state: AuthState) => {
    Object.assign(state, initialState);
};

export const setAuthLoading = (
    state: AuthState, 
    action: PayloadAction<boolean>
) => {
    state.loading = action.payload;
};

export const setAuthError = (
    state: AuthState,
    action: PayloadAction<string>
) => {
    state.error = action.payload
    state.loading = true
};