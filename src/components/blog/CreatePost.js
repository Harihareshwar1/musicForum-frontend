import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Form = styled.form`
  background: #2d1b36;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #ffd700;
  border-radius: 4px;
  color: white;
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #ffd700;
  border-radius: 4px;
  color: white;
  min-height: 150px;
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled.button`
  background: #ffd700;
  color: #2d1b36;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  margin-right: 1rem;
  cursor: pointer;
  &:hover {
    background: #ffed4a;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  margin-bottom: 1rem;
  background-image: url(${props => props.src || 'https://via.placeholder.com/400x200?text=No+Image'});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  border: 1px solid #ffd700;
`;

const CreatePost = ({ onClose, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const newPost = {
        title,
        content,
        image: image || 'https://via.placeholder.com/400x200?text=No+Image',
        author: user.id
      };

      await onPostCreated(newPost);
      onClose();
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Error creating post. Please try again.');
    }
  };

  return (
    <Modal onClick={onClose}>
      <Form onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2 style={{ color: '#ffd700', marginBottom: '1rem' }}>Create New Blog Post</h2>
        <ImagePreview src={image} />
        <Input
          type="url"
          placeholder="Image URL (paste from internet)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <ButtonContainer>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Post
          </Button>
        </ButtonContainer>
      </Form>
    </Modal>
  );
};

export default CreatePost;
