import React, { useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavbarContainer = styled.nav`
  background: #2d1b36;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  color: #ffd700;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: #ffed4a;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled.span`
  color: #fff;
  cursor: pointer;
  position: relative;
  padding-bottom: 0.25rem;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #ffd700;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #ffd700;
    &:after {
      width: 100%;
    }
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  color: #ffd700;
  font-weight: 500;
`;

const ProfileLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProfileIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-image: url(${props => props.src || 'https://via.placeholder.com/30x30'});
  background-size: cover;
  background-position: center;
  border: 2px solid #ffd700;
`;

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <NavbarContainer>
      <NavContainer>
        <Logo onClick={() => navigate('/blog')}>Music Forum</Logo>
        <NavLinks>
          <NavLink onClick={() => navigate('/blog')}>Blog</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink onClick={() => navigate('/profile')}>Profile</NavLink>
              <NavLink onClick={handleLogout}>Logout</NavLink>
            </>
          ) : (
            <NavLink onClick={() => navigate('/login')}>Login</NavLink>
          )}
        </NavLinks>
      </NavContainer>
    </NavbarContainer>
  );
}

export default Navbar;
