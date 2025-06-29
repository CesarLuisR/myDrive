import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/auth/useAuth";

export default function Home() {
    const { authenticated, user, initialized, loading, error } = useAuth();

    if (!initialized || loading) {
        return "Cargando...";
    }

    if (!authenticated) {
        console.log("KLK");
        return <Navigate to="/login" replace />;
    }

    if (error) {
        return "Error";
    }

    console.log("Se renderizo el HOME");
    return <div>
        Hola, estás en Home
        <div>{user?.name}</div>
    </div>;
}