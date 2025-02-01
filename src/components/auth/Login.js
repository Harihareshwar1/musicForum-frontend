import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode';
import config from '../../config';

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(10deg); }
  50% { transform: translateY(0px) rotate(0deg); }
  75% { transform: translateY(-10px) rotate(-10deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;

const glowText = keyframes`
  0%, 100% { text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #e60073; }
  50% { text-shadow: 0 0 20px #ffd700, 0 0 30px #ff4da6, 0 0 40px #ff4da6; }
`;

const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1b36 50%, #4a1942 100%);
  position: relative;
  overflow: hidden;
`;

const CircleDecoration = styled.div`
  position: absolute;
  width: ${props => props.size || '100px'};
  height: ${props => props.size || '100px'};
  border-radius: 50%;
  border: 2px solid rgba(255, 215, 0, 0.2);
  top: ${props => props.top};
  left: ${props => props.left};
  animation: ${spin} ${props => props.duration || '10s'} linear infinite;
`;

const LoginWrapper = styled.div`
  background: rgba(45, 27, 54, 0.9);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
              0 0 20px rgba(255, 215, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  text-align: center;
  position: relative;
  z-index: 1;
  animation: ${float} 6s ease-in-out infinite;
  transform-style: preserve-3d;
  
  &:hover {
    transform: scale(1.02) rotate(2deg);
    transition: all 0.3s ease;
  }
`;

const Title = styled.h1`
  color: #ffd700;
  font-size: 3rem;
  margin-bottom: 1rem;
  font-family: 'Arial', sans-serif;
  letter-spacing: 3px;
  animation: ${glowText} 2s ease-in-out infinite;
  position: relative;
  
  &::after {
    content: '🎵';
    position: absolute;
    top: -10px;
    right: -30px;
    font-size: 1.5rem;
    animation: ${bounce} 2s ease-in-out infinite;
  }
`;

const Subtitle = styled.p`
  color: #fff;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  position: relative;
  
  &::before, &::after {
    content: '~';
    color: #ffd700;
    margin: 0 10px;
    display: inline-block;
    animation: ${float} 3s ease-in-out infinite;
  }
`;

const GoogleLoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(0,0,0,0) 70%);
    animation: ${bounce} 2s ease-in-out infinite;
  }
  
  & > div {
    transform: scale(1.2);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.3) rotate(2deg);
    }
  }
`;

const MusicNote = styled.div`
  position: absolute;
  color: rgba(255, 215, 0, 0.3);
  font-size: ${props => props.size || '2rem'};
  animation: ${float} ${props => props.duration || '6s'} ease-in-out infinite;
  top: ${props => props.top};
  left: ${props => props.left};
  transform: rotate(${props => props.rotate || '0deg'});
  z-index: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  &:hover {
    color: rgba(255, 215, 0, 0.6);
    transform: scale(1.2) rotate(${props => props.rotate || '0deg'});
  }
`;

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      const response = await axios.post(`${config.API_BASE_URL}/auth/google-login`, {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
        picture: decoded.picture
      });
      
      const data = await response.data;
      
      if (data.success && data.token) {
        login({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          picture: decoded.picture,
          token: data.token
        });
        navigate('/blog');
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <LoginContainer>
      <CircleDecoration size="200px" top="10%" left="10%" duration="20s" />
      <CircleDecoration size="150px" top="20%" left="80%" duration="15s" />
      <CircleDecoration size="100px" top="70%" left="20%" duration="10s" />
      
      <MusicNote size="3rem" top="15%" left="20%" rotate="20deg" duration="7s">♪</MusicNote>
      <MusicNote size="2.5rem" top="25%" left="85%" rotate="-15deg" duration="8s">♫</MusicNote>
      <MusicNote size="4rem" top="75%" left="15%" rotate="45deg" duration="6s">♩</MusicNote>
      <MusicNote size="3.5rem" top="65%" left="80%" rotate="-30deg" duration="9s">♬</MusicNote>
      <MusicNote size="3rem" top="40%" left="50%" rotate="15deg" duration="7s">♪</MusicNote>
      
      <LoginWrapper>
        <Title>Music Forum</Title>
        <Subtitle>Join the rhythm of conversation!</Subtitle>
        <GoogleLoginWrapper>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            theme="filled_black"
            shape="pill"
            size="large"
            text="continue_with"
            useOneTap
          />
        </GoogleLoginWrapper>
      </LoginWrapper>
    </LoginContainer>
  );
}

export default Login;