import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Blog from './components/Blog';
import Profile from './components/Profile';
import styled from 'styled-components';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Styled components for main content
const MainContent = styled.main`
  padding: 2rem;
  background-color: #1e1e1e;
  color: white;
  min-height: 100vh;
`;

const AppContainer = styled.div`
  background-color: #1e1e1e;
  color: white;
  min-height: 100vh;
`;

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <Navbar />
          <MainContent>
            <Routes>
              <Route path="/" element={<Navigate to="/blog" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/blog" element={<Blog />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/blog" />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
};

export default App;
