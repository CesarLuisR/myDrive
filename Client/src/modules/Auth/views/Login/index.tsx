import { useState } from "react";
import type { LogInData } from "../../../../services/authService";
import useLogin from "../../../../hooks/auth/useLogin";
import { Link, useNavigate } from "react-router-dom";
import {
    Container,
    LoginCard,
    LoginHeader,
    Title,
    Subtitle,
    Form,
    InputGroup,
    Input,
    SubmitButton,
    StateMessage,
    Spinner,
    SignupSection,
    SignupText,
    SignupLink
} from "./styled";

const initialState: LogInData = {
    identifier: "",
    password: ""
};

export default function Login() {
    const [formData, setFormData] = useState<LogInData>(initialState);
    const { login, error, loading } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const success = await login(formData);
        if (success) {
            navigate("/");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Container>
            <LoginCard>
                <LoginHeader>
                    <Title>DriveShare</Title>
                    <Subtitle>Accede a tu espacio personal</Subtitle>
                </LoginHeader>

                <Form onSubmit={handleSubmit}>
                    {loading && (
                        <StateMessage $type="loading">
                            <Spinner />
                            Iniciando sesión...
                        </StateMessage>
                    )}
                    
                    {error && (
                        <StateMessage $type="error">
                            ⚠️ Error al iniciar sesión
                        </StateMessage>
                    )}

                    <InputGroup>
                        <Input
                            name="identifier"
                            type="text"
                            placeholder="Usuario o email"
                            value={formData.identifier}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </InputGroup>

                    <InputGroup>
                        <Input
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </InputGroup>

                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? "Iniciando..." : "Iniciar Sesión"}
                    </SubmitButton>
                </Form>

                <SignupSection>
                    <SignupText>¿No tienes una cuenta?</SignupText>
                    <SignupLink as={Link} to="/signup">
                        Crear cuenta nueva
                    </SignupLink>
                </SignupSection>
            </LoginCard>
        </Container>
    );
}