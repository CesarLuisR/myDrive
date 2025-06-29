import type { PayloadAction } from "@reduxjs/toolkit"
import { initialState, type AuthState } from "./authType";
import type { User } from "../../types/User";

export const setCredentialsEvent = (
    state: AuthState, 
    action: PayloadAction<User>
) => {
    state.user = action.payload
    state.authenticated = true
};

export const clearCredentialsEvent = (state: AuthState) => {
    Object.assign(state, initialState);
};

export const setAuthLoadingEvent = (
    state: AuthState, 
    action: PayloadAction<boolean>
) => {
    state.loading = action.payload;
};

export const setAuthErrorEvent = (
    state: AuthState,
    action: PayloadAction<string>
) => {
    state.error = action.payload
    state.loading = true
};