import { useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../context/store";
import { useDispatch } from "react-redux";
import { clearCredentials, setAuthError, setAuthLoading, setCredentials } from "../../context/auth/authSlice";
import { loadUserService } from "../../services/authService";
import { useCallback, useEffect, useState } from "react";

export default function useAuth() {
    const dispatch = useDispatch<AppDispatch>();
    const { authenticated, loading, error, user } = useSelector((state: RootState) => state.auth);
    const [initialized, setInitialized] = useState(false);

    const loadUser = useCallback(async () => {
        try {
            dispatch(setAuthLoading(true));
            const data = await loadUserService();
            dispatch(setCredentials(data.user));
        } catch(e) {
            dispatch(clearCredentials());
            dispatch(setAuthError("Error en el load"));
            console.error(e);
        } finally {
            dispatch(setAuthLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        (async () => {
            await loadUser();
            setInitialized(true);
        })();
    }, [loadUser]);

    return { authenticated, initialized, loading, error, user };
}