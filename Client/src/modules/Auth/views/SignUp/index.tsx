import { useState } from "react";
import type { SignUpData } from "../../../../services/authService";
import useSignUp from "../../../../hooks/auth/useSignUp";
import { Link } from "react-router-dom";
import {
    Container,
    SignUpCard,
    SignUpHeader,
    Title,
    Subtitle,
    Form,
    InputRow,
    InputGroup,
    Input,
    SubmitButton,
    StateMessage,
    Spinner,
    LoginSection,
    LoginText,
    LoginLink
} from "./styled";

const initialState: SignUpData = {
    name: "",
    lastname: "",
    email: "",
    password: ""
};

export default function SignUp() {
    const [formData, setFormData] = useState<SignUpData>(initialState);
    const { signUp, error, loading } = useSignUp();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        signUp(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Container>
            <SignUpCard>
                <SignUpHeader>
                    <Title>DriveShare</Title>
                    <Subtitle>Crea tu cuenta y comienza a compartir</Subtitle>
                </SignUpHeader>

                <Form onSubmit={handleSubmit}>
                    {loading && (
                        <StateMessage $type="loading">
                            <Spinner />
                            Creando cuenta...
                        </StateMessage>
                    )}
                    
                    {error && (
                        <StateMessage $type="error">
                            ⚠️ Error al crear la cuenta
                        </StateMessage>
                    )}

                    <InputRow>
                        <InputGroup>
                            <Input
                                type="text"
                                name="name"
                                placeholder="Nombre"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </InputGroup>
                        
                        <InputGroup>
                            <Input
                                type="text"
                                name="lastname"
                                placeholder="Apellido"
                                value={formData.lastname}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </InputGroup>
                    </InputRow>

                    <InputGroup className="full-width">
                        <Input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </InputGroup>

                    <InputGroup className="password">
                        <Input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </InputGroup>

                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? "Creando cuenta..." : "Crear Cuenta"}
                    </SubmitButton>
                </Form>

                <LoginSection>
                    <LoginText>¿Ya tienes una cuenta?</LoginText>
                    <LoginLink as={Link} to="/login">
                        Iniciar sesión
                    </LoginLink>
                </LoginSection>
            </SignUpCard>
        </Container>
    );
}