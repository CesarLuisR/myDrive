import { createSlice } from "@reduxjs/toolkit"
import * as authEvents from "./authEvents";
import { initialState } from "./authType";
import { registerUser } from "./authThunks";

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: authEvents.setCredentials,
        clearCredentials: authEvents.clearCredentials,
        setAuthLoading: authEvents.setAuthLoading,
        setAuthError: authEvents.setAuthError
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true
            })
    }
});

export const { setCredentials, clearCredentials, setAuthLoading, setAuthError } = authSlice.actions;

export default authSlice.reducer;