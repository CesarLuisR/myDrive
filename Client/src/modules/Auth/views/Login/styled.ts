import styled, { keyframes } from "styled-components";

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Container principal
export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 50%, #d32f2f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

// Tarjeta principal
export const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 440px;
  animation: ${fadeIn} 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 32px 24px;
    max-width: 100%;
    border-radius: 20px;
  }
`;

// Header de login
export const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

export const Title = styled.h1`
  color: #1a1a1a;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #ff416c, #d32f2f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 400;
`;

// Formulario
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;

  &:nth-child(2) {
    animation-delay: 0.3s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  background: #fafafa;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #999;
    font-weight: 400;
  }

  &:focus {
    border-color: #ff416c;
    background: white;
    box-shadow: 0 0 0 4px rgba(255, 65, 108, 0.1);
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: #ddd;
    background: white;
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 16px; /* Previene zoom en iOS */
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  position: relative;
  overflow: hidden;
  animation: ${slideIn} 0.6s ease-out 0.5s both;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 65, 108, 0.4);
    animation: ${pulse} 2s infinite;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
    animation: none !important;
  }

  @media (max-width: 768px) {
    padding: 14px;
    font-size: 1rem;
  }
`;

// Estados
export const StateMessage = styled.div<{ $type: 'loading' | 'error' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  font-weight: 500;
  animation: ${slideIn} 0.4s ease-out;
  
  ${props => props.$type === 'loading' && `
    background: rgba(255, 65, 108, 0.1);
    color: #d32f2f;
    border: 1px solid rgba(255, 65, 108, 0.2);
  `}
  
  ${props => props.$type === 'error' && `
    background: rgba(220, 38, 38, 0.1);
    color: #dc2626;
    border: 1px solid rgba(220, 38, 38, 0.2);
  `}
`;

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(211, 47, 47, 0.3);
  border-top: 2px solid #d32f2f;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Footer de registro
export const SignupSection = styled.div`
  margin-top: 32px;
  text-align: center;
  animation: ${slideIn} 0.6s ease-out 0.6s both;
`;

export const SignupText = styled.p`
  color: #666;
  font-size: 0.95rem;
  margin: 0 0 12px 0;
`;

export const SignupLink = styled.a`
  color: #ff416c;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #ff416c, #d32f2f);
    transition: width 0.3s ease;
  }

  &:hover {
    color: #d32f2f;
    
    &::after {
      width: 100%;
    }
  }
`;