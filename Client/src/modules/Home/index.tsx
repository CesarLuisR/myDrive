import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/auth/useAuth";
import { Card, Container, ErrorContainer, ErrorSubtext, ErrorText, LoadingContainer, LoadingText, Spinner, Subtitle, Title, UserCard, UserLabel, UserName } from "./styled";

// Animaciones

export default function Home() {
    const { authenticated, user, initialized, loading, error } = useAuth();

    if (!initialized || loading) {
        return (
            <Container>
                <LoadingContainer>
                    <Spinner />
                    <LoadingText>Cargando...</LoadingText>
                </LoadingContainer>
            </Container>
        );
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    if (error) {
        return (
            <Container>
                <ErrorContainer>
                    <ErrorText>¡Oops! Algo salió mal</ErrorText>
                    <ErrorSubtext>Ha ocurrido un error inesperado</ErrorSubtext>
                </ErrorContainer>
            </Container>
        );
    }

    console.log("Se renderizo el HOME");
    
    return (
        <Container>
            <Card>
                <Title>¡Bienvenido!</Title>
                <Subtitle>Estás en tu panel principal</Subtitle>
                
                {user && (
                    <UserCard>
                        <UserLabel>Usuario conectado:</UserLabel>
                        <UserName>{user.name}</UserName>
                    </UserCard>
                )}
            </Card>
        </Container>
    );
}