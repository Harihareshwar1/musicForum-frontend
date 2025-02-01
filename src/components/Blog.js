import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import CreatePost from './blog/CreatePost';
import { AuthContext } from '../context/AuthContext';
import config from '../config';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1b36 50%, #1a1a1a 100%);
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const PostCard = styled.div`
  background: rgba(45, 27, 54, 0.9);
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  border: 1px solid rgba(255, 215, 0, 0.2);

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 215, 0, 0.4);
  }
`;

const PostHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AuthorName = styled.div`
  color: #ffd700;
  font-weight: bold;
  font-size: 1.1rem;
`;

const PostDate = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const PostImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.src || 'https://via.placeholder.com/400x200?text=No+Image'});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const PostContent = styled.div`
  padding: 1rem;
  color: #fff;
`;

const PostTitle = styled.h3`
  color: #ffd700;
  margin: 1rem;
  font-size: 1.5rem;
`;

const PostText = styled.div`
  padding: 1rem;
`;

const PostFooter = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #ffd700;
  border-radius: 4px;
  color: white;
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
  cursor: pointer;
  &:hover {
    background: #ffed4a;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const LikeButton = styled.button`
  background: transparent;
  color: ${props => props.liked ? '#ffd700' : '#fff'};
  border: 1px solid #ffd700;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    background: rgba(255, 215, 0, 0.1);
  }
`;

const LikeCount = styled.span`
  color: #ffd700;
  font-weight: bold;
`;

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

const CommentsModal = styled.div`
  background: #2d1b36;
  padding: 2rem;
  border-radius: 15px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  border: 2px solid rgba(255, 215, 0, 0.3);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #ffd700;
    border-radius: 4px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  &:hover {
    color: #ffd700;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Comment = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.strong`
  color: #ffd700;
`;

const CommentDate = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoadingText = styled.p`
  font-size: 1.5rem;
  color: #fff;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const ErrorText = styled.p`
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  color: #ffd700;
  font-size: 2.5rem;
`;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_BASE_URL}/blog`);
      setPosts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Error loading posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (postId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/blog/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost(response.data);
      }
      
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/blog/${postId}/comment`,
        { comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost(response.data);
      }
      
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
      
      setNewComment('');
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleCreatePost = async (newPost) => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/blog`,
        newPost,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      setPosts([response.data, ...posts]);
      setShowCreatePost(false);
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Error creating post. Please try again.');
    }
  };

  const closeCommentsModal = () => {
    setSelectedPost(null);
    setNewComment('');
  };

  const renderLikes = (post) => {
    const likeCount = post.likes ? post.likes.length : 0;
    const hasLiked = isAuthenticated && post.likes && post.likes.includes(user?.id);

    return (
      <ActionButtons>
        <LikeButton onClick={() => handleLikeToggle(post._id)} liked={hasLiked}>
          {hasLiked ? '❤️' : '🤍'} {likeCount}
        </LikeButton>
        <Button onClick={() => setSelectedPost(post)}>
          Comments ({post.comments ? post.comments.length : 0})
        </Button>
      </ActionButtons>
    );
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Loading posts...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorText>{error}</ErrorText>
        <Button onClick={fetchPosts}>Try Again</Button>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <Title>Music Forum</Title>
          {isAuthenticated && (
            <Button onClick={() => setShowCreatePost(true)}>
              Create New Post
            </Button>
          )}
        </Header>

        {showCreatePost && (
          <CreatePost
            onClose={() => setShowCreatePost(false)}
            onPostCreated={handleCreatePost}
          />
        )}

        <PostsContainer>
          {posts.map(post => (
            <PostCard key={post._id}>
              <PostHeader>
                <AuthorInfo>
                  <AuthorName>
                    {post.author?.name || post.author?.username || 'Anonymous'}
                  </AuthorName>
                </AuthorInfo>
                <PostDate>
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Date not available'}
                </PostDate>
              </PostHeader>
              <PostImage src={post.image} />
              <PostContent>
                <PostTitle>{post.title}</PostTitle>
                <PostText>{post.content}</PostText>
                <PostFooter>
                  {renderLikes(post)}
                </PostFooter>
              </PostContent>
            </PostCard>
          ))}
        </PostsContainer>

        {selectedPost && (
          <Modal onClick={closeCommentsModal}>
            <CommentsModal onClick={e => e.stopPropagation()}>
              <ModalHeader>
                <h2>Comments</h2>
                <CloseButton onClick={closeCommentsModal}>&times;</CloseButton>
              </ModalHeader>
              
              <CommentSection>
                {isAuthenticated ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <CommentInput
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(selectedPost._id);
                        }
                      }}
                    />
                    <Button onClick={() => handleAddComment(selectedPost._id)}>
                      Add
                    </Button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <Button onClick={() => navigate('/login')}>
                      Login to Comment
                    </Button>
                  </div>
                )}

                <CommentList>
                  {selectedPost.comments && selectedPost.comments.map((comment, index) => (
                    <Comment key={index}>
                      <CommentHeader>
                        <CommentAuthor>
                          {comment.user?.name || comment.user?.username || 'Anonymous'}
                        </CommentAuthor>
                        <CommentDate>
                          {comment.date ? new Date(comment.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Date not available'}
                        </CommentDate>
                      </CommentHeader>
                      {comment.text}
                    </Comment>
                  ))}
                </CommentList>
              </CommentSection>
            </CommentsModal>
          </Modal>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default Blog;
