import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authServices from "../../services/authService";
import type { SignUpData } from "../../services/authService";

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData: SignUpData, { rejectWithValue }) => {
        try {
            await authServices.registerUser(userData);
        } catch(e) {
            rejectWithValue(e);
        }
    }
)