import { useState } from "react";
import type { LogInData } from "../../../services/authService";
import useLogin from "../../../hooks/auth/useLogin";
import { Link, useNavigate } from "react-router-dom";

const initialState: LogInData = {
    identifier: "",
    password: ""
}

export default function Login() {
    const [formData, setFormData] = useState<LogInData>(initialState);
    const { login, error, loading } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const success = await login(formData);

        if (success)
            navigate("/");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            {loading && "Cargando...."}
            {error && "Hubo un error"}
            <input 
                name="identifier"
                type="text"
                placeholder="Name o email"
                onChange={handleChange}
                required
            />
            <input 
                name="password"
                type="password"
                placeholder="password"
                onChange={handleChange}
                required
            />
            <input 
                type="submit"
                value="Enviar"
            />
        </form>
        <div>No account???</div>
        <Link to="/signup">Create accout</Link>
        </div>
    )
}