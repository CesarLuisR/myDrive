import { useState } from "react";
import type { SignUpData } from "../../../services/authService";
import useSignUp from "../../../hooks/auth/useSignUp";
import { Link } from "react-router-dom";

const initialState: SignUpData = {
    name: "",
    lastname: "",
    email: "",
    password: ""
}

export default function SignUp() {
    const [formData, setFormData] = useState<SignUpData>(initialState);
    const { signUp, error, loading } = useSignUp();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        signUp(formData);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <div>
                    <form onSubmit={handleSubmit}>
            <h1>Create account</h1>
            {loading && <>Cargando....</>}
            {error && "Hubo un error"}
            <input
                className="border-2 p-1 mb-2 outline-none"
                type="text"
                name="name"
                placeholder="Nombre de usuario"
                onChange={handleChange}
                required
            />
            <input
                className="border-2 p-1 mb-2 outline-none"
                type="text"
                name="lastname"
                placeholder="Nombre de usuario"
                onChange={handleChange}
                required
            />
            <input
                className="border-2 p-1 mb-2 outline-none"
                type="text"
                name="email"
                placeholder="Correo electronico"
                onChange={handleChange}
                required
            />
            <input
                className="border-2 p-1 mb-2 outline-none"
                type="text"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <input
                type="submit"
                value="Enviar"
            />
        </form>
        <div>You have an account??</div>
        <Link to="/login">Login</Link>

        </div>
    )
}