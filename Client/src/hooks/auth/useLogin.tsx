import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { type AppDispatch, type RootState } from "../../context/store";
import { loginUserService, type LogInData } from "../../services/authService";
import { setAuthError, setAuthLoading, setCredentials } from "../../context/auth/authSlice";

export default function useLogin() {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const login = async (credentials: LogInData): Promise<boolean> => {
        try {
            dispatch(setAuthLoading(true));
            const data = await loginUserService(credentials);

            dispatch(setCredentials(data.user));
            return true
        } catch(e) {
            console.error(e);
            dispatch(setAuthError("There was an error"));
            return false;
        } finally {
            dispatch(setAuthLoading(false));
        }
    }

    return { login, error, loading }
}