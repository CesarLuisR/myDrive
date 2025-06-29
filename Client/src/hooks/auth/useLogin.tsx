import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { RootState } from "../../context/store";
import { loginUser, type LogInData } from "../../services/authService";
import { setAuthError, setAuthLoading, setCredentials } from "../../context/auth/authSlice";

export default function useLogin() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const login = async (credentials: LogInData) => {
        try {
            dispatch(setAuthLoading(true));
            const data = await loginUser(credentials);

            dispatch(setCredentials(data.user));
        } catch(e) {
            console.error(e);
            dispatch(setAuthError("There was an error"));
        } finally {
            dispatch(setAuthLoading(false));
        }
    }

    return { login, error, loading }
}