import { createSlice } from "@reduxjs/toolkit"
import * as authEvents from "./authEvents";
import { initialState } from "./authType";

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: authEvents.setCredentialsEvent,
        clearCredentials: authEvents.clearCredentialsEvent,
        setAuthLoading: authEvents.setAuthLoadingEvent,
        setAuthError: authEvents.setAuthErrorEvent
    },
    // No thunks, i dont like them. Hooks is my way
});

export const { setCredentials, clearCredentials, setAuthLoading, setAuthError } = authSlice.actions;

export default authSlice.reducer;