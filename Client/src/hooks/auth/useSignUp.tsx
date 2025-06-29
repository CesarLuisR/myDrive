import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { RootState } from "../../context/store";
import { setAuthError, setAuthLoading } from "../../context/auth/authSlice";
import { registerUserService , type SignUpData } from "../../services/authService";

export default function useSignUp() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const signUp = async (credentials: SignUpData) => {
        try {
            dispatch(setAuthLoading(true));
            await registerUserService(credentials);
        } catch(e) {
            console.error(e);
            dispatch(setAuthError("There was an error"));
        } finally {
            dispatch(setAuthLoading(false));
        }
    }

    return {loading, error, signUp}
}