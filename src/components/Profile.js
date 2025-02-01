import React, { useContext, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import config from '../config';

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`;

const ProfileContainer = styled.div`
  min-height: 90vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1b36 50%, #4a1942 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const ProfileCard = styled.div`
  background: rgba(45, 27, 54, 0.9);
  border-radius: 15px;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 215, 0, 0.3);
  backdrop-filter: blur(10px);
  animation: ${glow} 3s ease-in-out infinite;
  
  &:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
`;

const ProfilePicture = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-image: url(${props => props.src || 'https://via.placeholder.com/120x120'});
  background-size: cover;
  background-position: center;
  border: 3px solid #ffd700;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Name = styled.h2`
  color: #ffd700;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Email = styled.p`
  color: #fff;
  opacity: 0.9;
  margin: 0;
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const DetailSection = styled.div`
  margin-top: 2rem;
`;

const DetailTitle = styled.h3`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '${props => props.icon}';
    font-size: 1.4rem;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const DetailItem = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 1.2rem;
  border-radius: 8px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(10px);
    background: rgba(0, 0, 0, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const Label = styled.span`
  color: rgba(255, 215, 0, 0.8);
  font-size: 1.1rem;
`;

const Value = styled.span`
  color: #fff;
  font-weight: 500;
`;

const PreferenceSection = styled.div`
  margin-top: 2rem;
`;

const PreferenceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
    transform: translateX(10px);
  }
`;

const PreferenceIcon = styled.span`
  font-size: 1.5rem;
`;

const PreferenceText = styled.span`
  color: #fff;
  font-size: 1.1rem;
`;

function Profile() {
  const { user } = useContext(AuthContext);
  const [preferences] = useState([
    { icon: '🎸', text: 'Rock & Metal' },
    { icon: '🎹', text: 'Classical & Jazz' },
    { icon: '🎧', text: 'Electronic Music' }
  ]);

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const joinDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <ProfilePicture src={user.picture} />
          <ProfileInfo>
            <Name>{user.name}</Name>
            <Email>{user.email}</Email>
          </ProfileInfo>
        </ProfileHeader>

        <DetailSection>
          <DetailTitle icon="👤">Account Information</DetailTitle>
          <DetailGrid>
            <DetailItem>
              <Label>Account Type</Label>
              <Value>Google Account</Value>
            </DetailItem>
            <DetailItem>
              <Label>Member Since</Label>
              <Value>{joinDate}</Value>
            </DetailItem>
            <DetailItem>
              <Label>Status</Label>
              <Value>Active</Value>
            </DetailItem>
            <DetailItem>
              <Label>Last Login</Label>
              <Value>Today</Value>
            </DetailItem>
          </DetailGrid>
        </DetailSection>

        <DetailSection>
          <DetailTitle icon="🎵">Music Preferences</DetailTitle>
          {preferences.map((pref, index) => (
            <PreferenceItem key={index}>
              <PreferenceIcon>{pref.icon}</PreferenceIcon>
              <PreferenceText>{pref.text}</PreferenceText>
            </PreferenceItem>
          ))}
        </DetailSection>

      </ProfileCard>
    </ProfileContainer>
  );
}

export default Profile;
