import { useSelector } from "react-redux";
import type { RootState } from "../../context/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react'; 

export default function Home() {
    const { authenticated } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authenticated) {
            navigate("/login");
        }
    }, [authenticated, navigate]);

    if (!authenticated) {
        return <div>Redirigiendo...</div>;
    }

    return <div>Hola, estás en Home</div>;
}