import styled, { keyframes } from "styled-components";

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components
export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', Tauaho, Geneva, Verdana, sans-serif;
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 400px;
  animation: ${fadeIn} 0.6s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 300;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 30px;
  font-weight: 400;
`;

export const UserCard = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
  margin-top: 20px;
  box-shadow: 0 10px 20px rgba(240, 147, 251, 0.3);
`;

export const UserName = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 500;
`;

export const UserLabel = styled.p`
  margin: 5px 0 0 0;
  font-size: 0.9rem;
  opacity: 0.9;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingText = styled.p`
  color: white;
  font-size: 1.2rem;
  margin: 0;
`;

export const ErrorContainer = styled.div`
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
`;

export const ErrorText = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
`;

export const ErrorSubtext = styled.p`
  margin: 10px 0 0 0;
  opacity: 0.9;
`;