import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Link, useNavigate, Navigate, useParams, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { AnimatePresence, motion } from 'framer-motion';

const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(270deg, #ff9a9e, #fad0c4, #fbc2eb, #a1c4fd, #c2ffd8, #fcb69f, #ffe5d9, #f6d365, #fda085);
    background-size: 300% 300%;
    animation: cartoonGradientShift 12s ease-in-out infinite;
    font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
    margin: 0;
    padding: 0;
  }

  @keyframes cartoonGradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const AuthContext = createContext();
const hardcoded = { username: 'admin', password: 'funky123' };

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => localStorage.getItem('user'));
  const login = (username, password) => {
    if (username === hardcoded.username && password === hardcoded.password) {
      setUser(username);
      localStorage.setItem('user', username);
      return true;
    }
    return false;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

const FunkyHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--cartoon-coral);
  color: #fff;
  padding: 1.5rem 2.5rem;
  border-bottom: 6px solid var(--cartoon-sunny);
  box-shadow: 0 8px 24px var(--cartoon-coral), 0 2px 8px var(--cartoon-sunny);
  font-family: 'Permanent Marker', 'Fredoka One', cursive;
  font-size: 2.2rem;
`;

const FunkyButton = styled(motion.button)`
  background: var(--cartoon-sunny);
  color: var(--cartoon-coral);
  border: 4px solid var(--cartoon-coral);
  border-radius: 30px;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.7rem 2rem;
  box-shadow: 0 6px 20px rgba(255, 97, 166, 0.2), 0 2px 8px var(--cartoon-sunny);
  cursor: pointer;
  margin-left: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s;
  &:hover {
    background: var(--cartoon-coral);
    color: var(--cartoon-sunny);
    transform: scale(1.08) rotate(-2deg);
    box-shadow: 0 12px 30px rgba(255, 97, 166, 0.3), 0 4px 16px var(--cartoon-sunny);
  }
`;

const CartoonCard = styled.div`
  background: linear-gradient(145deg, #fff, #f8fafc);
  border-radius: 25px;
  border: 4px solid var(--cartoon-coral);
  box-shadow: 0 8px 24px #ff61a633, 0 2px 8px var(--cartoon-sunny);
  padding: 2rem;
  margin: 1rem 0;
  position: relative;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
`;

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring' } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
};

// Cartoon Props
const CartoonPropContainer = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  z-index: 0;
`;

const Cloud = styled.div`
  position: absolute;
  background: #fff;
  border-radius: 50%;
  width: ${props => props.size || 120}px;
  height: ${props => props.size ? props.size * 0.6 : 72}px;
  left: ${props => props.left || 0};
  top: ${props => props.top || 0};
  box-shadow: 40px 0 0 0 #fff, 80px 0 0 0 #fff;
  opacity: 0.7;
  animation: floatCloud 18s linear infinite;
  animation-delay: ${props => props.delay || 0}s;

  @keyframes floatCloud {
    0% { transform: translateY(0px) translateX(0); }
    50% { transform: translateY(-20px) translateX(30px); }
    100% { transform: translateY(0px) translateX(0); }
  }
`;

const Star = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  left: ${props => props.left || 0};
  top: ${props => props.top || 0};
  background: none;
  z-index: 1;
  &:before, &:after {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    width: 4px;
    height: 24px;
    background: #ffe066;
    border-radius: 2px;
  }
  &:after {
    transform: rotate(90deg);
  }
  animation: twinkle 2s infinite alternate;
  animation-delay: ${props => props.delay || 0}s;

  @keyframes twinkle {
    0% { opacity: 0.7; }
    100% { opacity: 1; }
  }
`;

const Sun = styled.div`
  position: absolute;
  left: 80vw;
  top: 5vh;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle at 30% 30%, #ffe066 80%, #ffb347 100%);
  border-radius: 50%;
  box-shadow: 0 0 60px 10px #ffe06699;
  z-index: 1;
  animation: sunPulse 4s infinite alternate;

  @keyframes sunPulse {
    0% { box-shadow: 0 0 60px 10px #ffe06699; }
    100% { box-shadow: 0 0 80px 20px #ffe066cc; }
  }
`;

const Rocket = styled.div`
  position: absolute;
  left: ${props => props.left || '2vw'};
  bottom: ${props => props.bottom || '10vh'};
  width: 48px;
  height: 100px;
  z-index: 1;
  animation: rocketFloat 5s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;

  @keyframes rocketFloat {
    0% { transform: translateY(0); }
    50% { transform: translateY(-30px); }
    100% { transform: translateY(0); }
  }

  /* Rocket body */
  & > .body {
    width: 28px;
    height: 70px;
    background: linear-gradient(180deg, #fff 60%, #ff61a6 100%);
    border-radius: 14px 14px 10px 10px / 30px 30px 20px 20px;
    margin: 0 auto;
    position: relative;
    box-shadow: 0 0 8px #ff61a6aa;
  }
  /* Rocket window */
  & > .body > .window {
    width: 16px;
    height: 16px;
    background: #a1c4fd;
    border-radius: 50%;
    border: 3px solid #ffe066;
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
  }
  /* Rocket fins */
  & > .fin-left, & > .fin-right {
    position: absolute;
    width: 14px;
    height: 24px;
    background: #ffe066;
    border-radius: 0 0 14px 14px;
    bottom: 10px;
  }
  & > .fin-left {
    left: 0;
    transform: rotate(-20deg);
  }
  & > .fin-right {
    right: 0;
    transform: rotate(20deg);
  }
  /* Rocket flame */
  & > .flame {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 12px;
    height: 24px;
    background: radial-gradient(circle at 50% 30%, #ffe066 60%, #ffb347 100%);
    border-radius: 50% 50% 60% 60%;
    transform: translateX(-50%);
    opacity: 0.8;
    animation: flameFlicker 0.5s infinite alternate;
  }
  @keyframes flameFlicker {
    0% { height: 20px; opacity: 0.7; }
    100% { height: 28px; opacity: 1; }
  }
`;

const Planet = styled.div`
  position: absolute;
  width: ${props => props.size || 60}px;
  height: ${props => props.size || 60}px;
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  top: ${props => props.top || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  background: radial-gradient(circle at 30% 30%, ${props => props.color1 || '#a1c4fd'} 70%, ${props => props.color2 || '#fad0c4'} 100%);
  border-radius: 50%;
  box-shadow: 0 0 24px 4px ${props => props.color1 || '#a1c4fd'}44;
  z-index: 1;
  animation: planetSpin 18s linear infinite;

  @keyframes planetSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  /* Add a ring for some planets */
  &.ring:after {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    width: 80px;
    height: 16px;
    border-radius: 50%;
    border: 3px solid #ffe066;
    border-left: none;
    border-right: none;
    transform: translateY(-50%) rotate(-15deg);
    opacity: 0.5;
    pointer-events: none;
  }
`;

const CartoonLock = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem auto;
  position: relative;
  z-index: 2;
  animation: lockBounce 2s infinite ease-in-out;
  @keyframes lockBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-18px); }
  }
  .lock-body {
    width: 60px;
    height: 38px;
    background: #ffe066;
    border: 4px solid var(--cartoon-coral);
    border-radius: 16px 16px 18px 18px;
    position: absolute;
    bottom: 0;
    left: 0;
    box-shadow: 0 4px 12px #ffe06655;
  }
  .lock-shackle {
    width: 36px;
    height: 28px;
    border: 4px solid var(--cartoon-coral);
    border-bottom: none;
    border-radius: 20px 20px 0 0;
    position: absolute;
    left: 12px;
    top: -18px;
    background: none;
  }
  .lock-keyhole {
    width: 10px;
    height: 18px;
    background: #ff61a6;
    border-radius: 5px;
    position: absolute;
    left: 25px;
    top: 22px;
    z-index: 2;
    box-shadow: 0 2px 4px #ff61a655;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .lock-keyhole-dot {
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 50%;
    margin-bottom: -4px;
  }
`;

// Add AdminDashboard styled components
const StatGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  margin: 2rem 0 1.5rem 0;
  justify-content: center;
  flex-wrap: wrap;
`;
const StatCard = styled.div`
  flex: 1 1 180px;
  min-width: 180px;
  max-width: 240px;
  background: #fff;
  border-radius: 18px;
  border: 3px solid #eee;
  box-shadow: 0 4px 16px #ff61a622;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0.5rem;
  position: relative;
  transition: box-shadow 0.2s, border 0.2s;
  &:hover {
    box-shadow: 0 8px 32px #ff61a644;
    border: 3px solid var(--cartoon-coral);
  }
`;
const StatIcon = styled.div`
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
`;
const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #888;
  margin-top: 0.2rem;
`;
const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--cartoon-coral);
`;
const AdminSection = styled.div`
  background: #f9eaff;
  border-radius: 18px;
  border: 2px solid #e0cfff;
  margin: 2rem 0;
  padding: 1.5rem 1rem;
`;
const AdminTitle = styled.h2`
  font-family: 'Permanent Marker', 'Fredoka One', cursive;
  color: var(--cartoon-purple);
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;
const AdminWelcome = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`;
const AdminButton = styled(FunkyButton)`
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
  border: none;
  box-shadow: 0 4px 16px #38f9d755;
  margin: 0 1rem;
  &:hover {
    background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
    color: #fff;
  }
`;
const CreatePostButton = styled(FunkyButton)`
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
  border: none;
  box-shadow: 0 4px 16px #38f9d755;
  margin: 0 auto 2rem auto;
  display: block;
  &:hover {
    background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
    color: #fff;
  }
`;

const CardContainer = styled.div`
  max-width: 900px;
  width: 95%;
  margin: 2rem auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px #ff61a644, 0 2px 8px #38f9d755;
  border: 2px solid #e0cfff;
  overflow: hidden;
  position: relative;
  @media (max-width: 1200px) {
    max-width: 98vw;
  }
  @media (max-width: 800px) {
    max-width: 100vw;
    border-radius: 0;
    margin: 0;
  }
  @media (max-width: 600px) {
    padding: 0;
    min-width: 0;
  }
`;
const CardHeader = styled.div`
  background: linear-gradient(90deg, #a1c4fd 0%, #c2ffd8 100%);
  padding: 1.2rem 2rem 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const CardTitle = styled.h2`
  font-family: 'Permanent Marker', 'Fredoka One', cursive;
  color: #a259e6;
  font-size: 1.6rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #ff61a6; }
`;
const FieldLabel = styled.label`
  font-weight: bold;
  margin-bottom: 0.2rem;
  display: block;
  color: #222;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 2px solid #a1c4fd;
  font-size: 1rem;
  margin-bottom: 0.7rem;
  background: #f7faff;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
`;
const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 2px solid #a1c4fd;
  font-size: 1rem;
  margin-bottom: 0.7rem;
  background: #f7faff;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
`;
const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  .switch {
    width: 38px;
    height: 22px;
    background: #eee;
    border-radius: 12px;
    position: relative;
    transition: background 0.2s;
  }
  .switch-inner {
    position: absolute;
    left: 2px;
    top: 2px;
    width: 18px;
    height: 18px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 6px #a1c4fd44;
    transition: left 0.2s;
  }
  input:checked + .switch .switch-inner {
    left: 18px;
    background: #43e97b;
  }
  input:checked + .switch {
    background: #43e97b;
  }
`;
const ImageUpload = styled.div`
  text-align: center;
  margin: 1.2rem 0 1.5rem 0;
`;
const UploadText = styled.div`
  margin-bottom: 14px;
  color: #888;
  text-align: center;
  margin-top: -10px;
`;
const ChooseImageButton = styled(FunkyButton)`
  margin-top: 8px;
`;
const ImagePreview = styled.img`
  max-width: 120px;
  max-height: 120px;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;
const Toolbar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;
const ToolbarButton = styled.button`
  background: #f7faff;
  border: 2px solid #a1c4fd;
  border-radius: 8px;
  font-size: 1.1rem;
  padding: 4px 10px;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  &:hover { background: #a1c4fd22; border-color: #43e97b; }
`;
const Excerpt = styled.textarea`
  width: 100%;
  min-height: 40px;
  border-radius: 10px;
  border: 2px solid #a1c4fd;
  font-size: 1rem;
  margin-bottom: 1.2rem;
  background: #f7faff;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
  padding: 8px 12px;
`;
const PublishRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
`;
const PublishButton = styled(FunkyButton)`
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
  border: none;
  box-shadow: 0 4px 16px #38f9d755;
  min-width: 180px;
  font-size: 1.1rem;
  &:hover { background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%); color: #fff; }
`;
const PreviewButton = styled(FunkyButton)`
  background: #fff;
  color: #43e97b;
  border: 2px solid #43e97b;
  min-width: 100px;
  font-size: 1.1rem;
  &:hover { background: #43e97b; color: #fff; }
`;

// Update the Published field alignment
const PublishedField = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  height: 100%;
  min-height: 60px;
  padding-right: 8px;
`;

const PostCard = styled.div`
  max-width: 900px;
  margin: 2.5rem auto 2rem auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px #ff61a644, 0 2px 8px #38f9d755;
  border: 3px solid #e0cfff;
  overflow: hidden;
  position: relative;
  padding-bottom: 1.5rem;
  @media (max-width: 1200px) {
    max-width: 98vw;
  }
  @media (max-width: 800px) {
    max-width: 100vw;
    border-radius: 0;
    margin: 0;
  }
  @media (max-width: 600px) {
    padding: 0;
    min-width: 0;
  }
`;
const PostImage = styled.img`
  width: 100%;
  max-height: 260px;
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  display: block;
`;
const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 1rem;
  color: #888;
  margin: 1.2rem 0 0.5rem 0;
  padding: 0 2rem;
  flex-wrap: wrap;
`;
const PostTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;
const Tag = styled.span`
  background: #e0f7fa;
  color: #00bcd4;
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 0.95rem;
  font-weight: 600;
`;
const PostTitle = styled.h1`
  font-family: 'Permanent Marker', 'Fredoka One', cursive;
  color: #222;
  font-size: 2rem;
  margin: 0 0 1.2rem 0;
  padding: 0 2rem;
`;
const PostContent = styled.div`
  padding: 0 2rem;
  font-size: 1.13rem;
  line-height: 1.7;
  color: #222;
  word-break: break-word;
  
  /* HTML elements from Markdown conversion */
  & h1, & h2, & h3 {
    font-family: 'Permanent Marker', 'Fredoka One', cursive;
    color: #a259e6;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  & h1 { font-size: 2rem; }
  & h2 { font-size: 1.6rem; }
  & h3 { font-size: 1.3rem; }
  
  & pre, & code {
    background: #23272f;
    color: #fff;
    border-radius: 10px;
    padding: 12px;
    font-size: 1rem;
    font-family: 'Fira Mono', 'Consolas', monospace;
    margin: 1rem 0;
    display: block;
    overflow-x: auto;
  }
  
  & code:not(pre code) {
    background: #f1f3f4;
    color: #d73a49;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    display: inline;
  }
  
  & ul, & ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  & li {
    margin-bottom: 0.5rem;
  }
  
  & blockquote {
    border-left: 4px solid #a1c4fd;
    background: #f7faff;
    padding: 0.5rem 1rem;
    color: #555;
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  & a {
    color: #a1c4fd;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  
  & hr {
    border: none;
    border-top: 2px solid #a1c4fd;
    margin: 2rem 0;
  }
  
  & strong {
    font-weight: bold;
  }
  
  & em {
    font-style: italic;
  }
  
  & img {
    max-width: 100%;
    border-radius: 12px;
    margin: 1.2rem auto;
    display: block;
    box-shadow: 0 2px 8px #a1c4fd22;
  }
`;
const CommentsCard = styled.div`
  max-width: 900px;
  margin: 0 auto 2.5rem auto;
  background: #f7faff;
  border-radius: 18px;
  border: 2px solid #a1c4fd;
  box-shadow: 0 4px 16px #a1c4fd33;
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  @media (max-width: 1200px) {
    max-width: 98vw;
  }
  @media (max-width: 800px) {
    max-width: 100vw;
    border-radius: 0;
    margin: 0 0 2.5rem 0;
  }
`;
const CommentsHeader = styled.div`
  background: linear-gradient(90deg, #a1c4fd 0%, #c2ffd8 100%);
  border-radius: 12px 12px 0 0;
  padding: 0.7rem 1.2rem;
  font-family: 'Permanent Marker', 'Fredoka One', cursive;
  color: #38b6ff;
  font-size: 1.2rem;
  margin: -1.5rem -1.2rem 1.2rem -1.2rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;
const CommentBubble = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #a1c4fd22;
  padding: 1rem 1.2rem;
  margin-bottom: 1.1rem;
  font-size: 1.05rem;
  color: #333;
  position: relative;
`;
const CommentMeta = styled.div`
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

// Add at the top after other styled-components
const SearchBarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 2.5rem auto;
  padding-top: 2.5rem;
`;
const SearchBarBox = styled.form`
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #fbc2eb 0%, #a1c4fd 100%);
  border-radius: 40px;
  box-shadow: 0 4px 32px #a1c4fd44, 0 2px 8px #fbc2eb55;
  padding: 6px 16px 6px 24px;
  min-width: 340px;
  max-width: 540px;
  width: 100%;
  position: relative;
`;
const SearchInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 1.15rem;
  padding: 10px 12px;
  border-radius: 30px;
  flex: 1;
  color: #333;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
`;
const SearchButton = styled.button`
  background: linear-gradient(90deg, #a1c4fd 0%, #fbc2eb 100%);
  color: #fff;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 8px 28px;
  margin-left: 10px;
  box-shadow: 0 2px 12px #a1c4fd44;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: linear-gradient(90deg, #fbc2eb 0%, #a1c4fd 100%);
    color: #a259e6;
  }
`;
const CartoonHeader = styled.h1`
  text-align: center;
  font-size: 2.8rem;
  font-family: 'Permanent Marker', 'Fredoka One', cursive;
  margin: 0 0 0.5rem 0;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #ff61a6 0%, #a259e6 40%, #43e97b 80%, #38f9d7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  display: inline-block;
`;
const CartoonSub = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2.5rem;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
`;
const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.2rem;
  margin: 0 auto 2.5rem auto;
  max-width: 1200px;
  width: 100%;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const FunkyPostCard = styled.div`
  background: #fff;
  border-radius: 18px;
  border: 3px solid #e0cfff;
  box-shadow: 0 8px 32px #ff61a644, 0 2px 8px #38f9d755;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 340px;
  min-height: 420px;
  transition: box-shadow 0.2s, border 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 12px 40px #a1c4fd55;
    border: 3px solid #a1c4fd;
    transform: translateY(-6px) scale(1.02) rotate(-1deg);
  }
`;
const FunkyCardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  display: block;
`;
const FunkyCardBody = styled.div`
  padding: 1.2rem 1.3rem 1.1rem 1.3rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const FunkyCategory = styled.span`
  display: inline-block;
  background: linear-gradient(90deg, #a1c4fd 0%, #fbc2eb 100%);
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 10px;
  padding: 4px 16px;
  margin-bottom: 0.7rem;
  margin-right: 0.7rem;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
`;
const FunkyDate = styled.span`
  color: #888;
  font-size: 0.98rem;
  margin-left: 0.5rem;
`;
const FunkyCardTitle = styled.h2`
  font-family: 'Permanent Marker', 'Fredoka One', cursive;
  color: #222;
  font-size: 1.25rem;
  margin: 0 0 0.7rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const FunkyExcerpt = styled.div`
  color: #444;
  font-size: 1.05rem;
  margin-bottom: 1.1rem;
  flex: 1;
`;
const FunkyTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.7rem;
`;
const FunkyTag = styled.span`
  background: #e0f7fa;
  color: #00bcd4;
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 0.95rem;
  font-weight: 600;
`;
const FunkyCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.1rem;
`;
const FunkyMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  color: #888;
  font-size: 1rem;
`;
const FunkyReadMore = styled(FunkyButton)`
  background: linear-gradient(90deg, #a259e6 0%, #ff61a6 100%);
  color: #fff;
  border: none;
  box-shadow: 0 4px 16px #a259e655;
  margin: 0;
  min-width: 120px;
  font-size: 1.1rem;
  &:hover {
    background: linear-gradient(90deg, #ff61a6 0%, #a259e6 100%);
    color: #fff;
  }
`;

function App() {
  const [user] = useState(() => localStorage.getItem('user'));
  const location = useLocation();
  return (
    <AuthProvider>
      <GlobalStyle />
      <CartoonPropContainer>
        <Cloud size={120} left="10vw" top="8vh" delay={0} />
        <Cloud size={90} left="60vw" top="15vh" delay={4} />
        <Cloud size={70} left="30vw" top="20vh" delay={2} />
        <Star left="20vw" top="12vh" delay={0.5} />
        <Star left="75vw" top="10vh" delay={1.2} />
        <Star left="50vw" top="18vh" delay={2.1} />
        <Sun />
        {/* Rockets */}
        <Rocket left="2vw" bottom="10vh" delay={0}>
          <div className="body">
            <div className="window" />
          </div>
          <div className="fin-left" />
          <div className="fin-right" />
          <div className="flame" />
        </Rocket>
        <Rocket left="92vw" bottom="18vh" delay={2.5}>
          <div className="body">
            <div className="window" />
          </div>
          <div className="fin-left" />
          <div className="fin-right" />
          <div className="flame" />
        </Rocket>
        {/* Planets */}
        <Planet size={70} left="6vw" top="60vh" color1="#a1c4fd" color2="#fad0c4" />
        <Planet size={60} right="6vw" top="70vh" color1="#ffe066" color2="#ffb347" className="ring" />
      </CartoonPropContainer>
      <FunkyHeaderWithAdmin user={user} />
      <main style={{ maxWidth: 1100, margin: '2rem auto', background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px #ff61a633', padding: '2rem', position: 'relative', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          <div key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/post/:id" element={<PageWrapper><Post /></PageWrapper>} />
              <Route path="/new" element={<RequireAuth><PageWrapper><EditPost /></PageWrapper></RequireAuth>} />
              <Route path="/edit/:id" element={<RequireAuth><PageWrapper><EditPost /></PageWrapper></RequireAuth>} />
              <Route path="/admin" element={<RequireAuth><PageWrapper><AdminDashboard /></PageWrapper></RequireAuth>} />
            </Routes>
          </div>
        </AnimatePresence>
      </main>
    </AuthProvider>
  );
}

function AuthStatus() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (user) {
    return (
      <div>
        <span>Welcome, {user}!</span>
        <FunkyButton onClick={() => { logout(); navigate('/'); }}>Logout</FunkyButton>
        <Link to="/new"><FunkyButton>Add Post</FunkyButton></Link>
      </div>
    );
  } else {
    return <Link to="/login"><FunkyButton>Login</FunkyButton></Link>;
  }
}

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Post storage helpers
// Remove getPosts and savePosts helpers
// Replace all getPosts(), savePosts() usages with API calls

// Fetch all posts from API
async function fetchPosts() {
  const res = await fetch('/api/getPosts');
  if (!res.ok) return [];
  return await res.json();
}
// Fetch a single post by ID
async function fetchPost(id) {
  const res = await fetch(`/api/getPost?id=${id}`);
  if (!res.ok) return null;
  return await res.json();
}
// Create a new post
async function createPost(post, token) {
  const res = await fetch('/api/createPost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(post)
  });
  return await res.json();
}
// Update a post
async function updatePost(id, post, token) {
  const res = await fetch('/api/updatePost', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ id, ...post })
  });
  return await res.json();
}

// Helper function to convert Markdown to HTML
function markdownToHtml(content) {
  let html = content;
  
  // Convert headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Convert bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)\n```/g, '<pre><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Convert images
  html = html.replace(/!\[\]\((data:image\/[^)]+)\)/g, '<img src="$1" alt="" style="max-width: 100%; border-radius: 12px; margin: 1.2rem auto; display: block; box-shadow: 0 2px 8px #a1c4fd22;" />');
  
  // Convert blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
  
  // Convert horizontal rules
  html = html.replace(/^---$/gim, '<hr>');
  
  // Convert lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  
  // Wrap consecutive list items in ul/ol tags
  html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
    const items = match.match(/<li>.*?<\/li>/g);
    if (items && items.length > 0) {
      // Check if it's numbered list by looking at the original content
      const originalLines = content.split('\n');
      const listStartIndex = originalLines.findIndex(line => line.match(/^\d+\./));
      if (listStartIndex !== -1) {
        return `<ol>${match}</ol>`;
      } else {
        return `<ul>${match}</ul>`;
      }
    }
    return match;
  });
  
  // Convert line breaks to <br>
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: 400 }}
    >
      {children}
    </motion.div>
  );
}

// Helper to strip Markdown images from text
function stripImagesFromMarkdown(text) {
  return text.replace(/!\[.*?\]\([^)]*\)/g, '').trim();
}

function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  React.useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);
  // Filter posts by search
  const filteredPosts = posts.filter(post => {
    const q = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      (post.category && post.category.toLowerCase().includes(q)) ||
      (post.tags && post.tags.toLowerCase().includes(q)) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(q)) ||
      (post.content && post.content.toLowerCase().includes(q))
    );
  });
  return (
    <div>
      <SearchBar
        value={search}
        onChange={e => setSearch(e.target.value)}
        onSubmit={e => { e.preventDefault(); }}
      />
      <CartoonHeader>
        Latest <span style={{ color: '#ff61a6', background: 'none', WebkitTextFillColor: 'unset' }}>Adventures</span> in Code! <span role="img" aria-label="rocket">🚀</span>
      </CartoonHeader>
      <CartoonSub>
        Discover amazing tutorials, tips, and creative projects!
      </CartoonSub>
      <PostsGrid>
        {filteredPosts.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', fontSize: 22, fontWeight: 600, padding: '2rem 0' }}>
            No posts found.
          </div>
        ) : (
          filteredPosts.map(post => {
            const tagList = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
            return (
              <FunkyPostCard key={post.id}>
                {post.image && <FunkyCardImage src={post.image} alt={post.title} />}
                <FunkyCardBody>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    {post.category && <FunkyCategory>{post.category.charAt(0).toUpperCase() + post.category.slice(1)}</FunkyCategory>}
                    <FunkyDate><span role="img" aria-label="date">📅</span> {new Date(post.date).toLocaleDateString()}</FunkyDate>
                  </div>
                  <FunkyCardTitle>
                    {post.title.includes('Welcome') ? '📢' : post.title.includes('React') ? '⚡' : post.title.includes('CSS') ? '🍩' : '✨'} {post.title}
                  </FunkyCardTitle>
                  <FunkyExcerpt>
                    {post.excerpt
                      ? stripImagesFromMarkdown(post.excerpt)
                      : stripImagesFromMarkdown(post.content).slice(0, 120) + (stripImagesFromMarkdown(post.content).length > 120 ? '...' : '')}
                  </FunkyExcerpt>
                  <FunkyTags>
                    {tagList.slice(0, 4).map(tag => <FunkyTag key={tag}>#{tag}</FunkyTag>)}
                    {tagList.length > 4 && <FunkyTag>+{tagList.length - 4}</FunkyTag>}
                  </FunkyTags>
                  <FunkyCardFooter>
                    <FunkyMeta>
                      <span><span role="img" aria-label="author">👤</span> {post.author || 'DW Dev'}</span>
                      <span><span role="img" aria-label="views">👁️</span> {post.views ?? '—'}</span>
                      <span><span role="img" aria-label="comments">💬</span> {getComments(post.id).length}</span>
                    </FunkyMeta>
                    <FunkyReadMore onClick={() => navigate(`/post/${post.id}`)}>Read More &rarr;</FunkyReadMore>
                  </FunkyCardFooter>
                </FunkyCardBody>
              </FunkyPostCard>
            );
          })
        )}
      </PostsGrid>
    </div>
  );
}

function Post() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const hasIncrementedView = React.useRef(false);
  React.useEffect(() => {
    if (!id) return;
    fetchPost(id).then(setPost);
  }, [id]);
  React.useEffect(() => {
    if (post && post.id) {
      setComments(getComments(post.id));
    }
  }, [post]);
  const refreshComments = () => {
    if (post && post.id) {
      setComments(getComments(post.id));
    }
  };
  const handleAddComment = e => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      author: user || getOrCreateGuestId(),
      date: new Date().toLocaleDateString(),
      text: commentText.trim()
    };
    const updated = [newComment, ...getComments(post.id)];
    saveComments(post.id, updated);
    setCommentText('');
    refreshComments();
  };
  const handleDeleteComment = idx => {
    const updated = getComments(post.id).filter((_, i) => i !== idx);
    saveComments(post.id, updated);
    refreshComments();
  };
  if (!post) return <h2>Post not found</h2>;
  // Parse tags
  const tagList = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  return (
    <>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
        <FunkyButton 
          onClick={() => navigate('/')} 
          style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Back to Posts
        </FunkyButton>
      </div>
      <PostCard>
        {post.image && <PostImage src={post.image} alt={post.title} />}
        <PostMeta>
          <span><span role="img" aria-label="date">📅</span> {new Date(post.date).toLocaleDateString()}</span>
          <span><span role="img" aria-label="author">👤</span> {post.author || 'DW Developer'}</span>
          {tagList.length > 0 && (
            <PostTags>
              {tagList.map(tag => <Tag key={tag}>{tag}</Tag>)}
            </PostTags>
          )}
        </PostMeta>
        <PostTitle>{post.title}</PostTitle>
        <PostContent>
          {console.log('[DEBUG] Raw markdown content:', post.content)}
          {(() => {
            const processedContent = markdownToHtml(post.content);
            console.log('[DEBUG] Processed content:', processedContent);
            return (
              <div 
                dangerouslySetInnerHTML={{ __html: processedContent }}
                style={{ 
                  fontSize: '1.13rem',
                  lineHeight: '1.7',
                  color: '#222',
                  wordBreak: 'break-word'
                }}
              />
            );
          })()}
        </PostContent>
      </PostCard>
      <CommentsCard>
        <CommentsHeader>
          <span role="img" aria-label="comments">💬</span> Comments ({comments.length})
        </CommentsHeader>
        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          <input
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            style={{ flex: 1, borderRadius: 8, border: '2px solid #a1c4fd', padding: 8, fontSize: 16, fontFamily: 'Comic Sans MS, Comic Sans, cursive' }}
          />
          <FunkyButton type="submit" style={{ minWidth: 80 }}>Post</FunkyButton>
        </form>
        {comments.map((c, i) => (
          <CommentBubble key={i}>
            <CommentMeta>
              <span role="img" aria-label="author">👤</span> {c.author} <span role="img" aria-label="date">🗓️</span> {c.date}
              {user && (
                <FunkyButton type="button" style={{ marginLeft: 8, padding: '2px 10px', fontSize: 14, background: '#ff61a6', color: '#fff', border: 'none' }} onClick={() => handleDeleteComment(i)}>
                  Delete
                </FunkyButton>
              )}
            </CommentMeta>
            {c.text}
          </CommentBubble>
        ))}
      </CommentsCard>
    </>
  );
}

function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(true);
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [author, setAuthor] = useState('');
  React.useEffect(() => {
    if (editing) {
      fetchPost(id).then(post => {
        if (post) {
          setTitle(post.title);
          setContent(post.content);
          setCategory(post.category || '');
          setTags(post.tags || '');
          setPublished(post.published !== false);
          setExcerpt(post.excerpt || '');
          setImagePreview(post.image || null);
          setAuthor(post.author || '');
        }
      });
    }
  }, [editing, id]);
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleToolbar = async cmd => {
    if (cmd === 'bold') setContent(content + '**bold**');
    if (cmd === 'italic') setContent(content + '*italic*');
    if (cmd === 'link') setContent(content + '[text](url)');
    if (cmd === 'h1') setContent(content + '\n# Heading 1\n');
    if (cmd === 'h2') setContent(content + '\n## Heading 2\n');
    if (cmd === 'ul') setContent(content + '\n- List item\n');
    if (cmd === 'ol') setContent(content + '\n1. List item\n');
    if (cmd === 'code') setContent(content + '\n```js\ncode here\n```\n');
    if (cmd === 'quote') setContent(content + '\n> Blockquote\n');
    if (cmd === 'hr') setContent(content + '\n---\n');
    if (cmd === 'image') {
      // Open file dialog and insert base64 image into Markdown
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = e => {
        const file = e.target.files[0];
        if (file) {
          setUploading(true);
          const reader = new FileReader();
          reader.onloadend = () => {
            setContent(content + `\n![](${reader.result})\n`);
            setUploading(false);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const token = localStorage.getItem('token');
    const postData = {
      title, content, category, tags, published, excerpt, image: imagePreview, author
    };
    if (editing) {
      await updatePost(id, postData, token);
      navigate(`/post/${id}`);
    } else {
      const newPost = await createPost(postData, token);
      navigate(`/post/${newPost.id}`);
    }
  };
  return (
    <CardContainer>
      <CardHeader>
        <CardTitle><span role="img" aria-label="rocket">🚀</span> {editing ? 'Edit Post' : 'Create New Post'} <span role="img" aria-label="sparkles">✨</span></CardTitle>
        <CloseButton onClick={() => navigate('/')}>×</CloseButton>
      </CardHeader>
      <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
        <FieldLabel>Post Title</FieldLabel>
        <Input placeholder="Enter an amazing title..." value={title} onChange={e => setTitle(e.target.value)} />
        <FieldLabel>Author</FieldLabel>
        <Input placeholder="Author name" value={author} onChange={e => setAuthor(e.target.value)} />
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>Category</FieldLabel>
            <Select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Select category</option>
              <option value="tech">Tech</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="tutorial">Tutorial</option>
              <option value="news">News</option>
            </Select>
          </div>
          <div style={{ flex: 1 }}>
            <FieldLabel>Tags <span style={{ fontWeight: 400, color: '#888' }}>(comma separated)</span></FieldLabel>
            <Input placeholder="react, javascript, tutorial" value={tags} onChange={e => setTags(e.target.value)} />
          </div>
          <PublishedField style={{ flex: 1, minWidth: 160 }}>
            <FieldLabel style={{ marginBottom: 8 }}>Published</FieldLabel>
            <ToggleSwitch>
              <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} style={{ display: 'none' }} />
              <span className="switch"><span className="switch-inner" /></span>
              <span style={{ marginLeft: 8, color: '#888' }}>{published ? 'Published' : 'Draft'}</span>
            </ToggleSwitch>
          </PublishedField>
        </div>
        <FieldLabel>Featured Image</FieldLabel>
        <ImageUpload>
          {imagePreview ? <ImagePreview src={imagePreview} alt="Preview" /> : <div style={{ fontSize: 48, color: '#43e97b', marginBottom: 8 }}>⤴️</div>}
          <UploadText>Upload your featured image</UploadText>
          <label>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            <ChooseImageButton as="span" type="button">Choose Image</ChooseImageButton>
          </label>
        </ImageUpload>
        <FieldLabel>Content</FieldLabel>
        <Toolbar>
          <ToolbarButton type="button" onClick={() => handleToolbar('bold')} title="Bold"><b>B</b></ToolbarButton>
          <ToolbarButton type="button" onClick={() => handleToolbar('italic')} title="Italic"><i>I</i></ToolbarButton>
          <ToolbarButton type="button" onClick={() => handleToolbar('link')} title="Link">🔗</ToolbarButton>
          <ToolbarButton type="button" onClick={() => handleToolbar('h1')} title="Heading 1">H1</ToolbarButton>
          <ToolbarButton type="button" onClick={() => handleToolbar('h2')} title="Heading 2">H2</ToolbarButton>
          <ToolbarButton type="button" onClick={() => handleToolbar('ul')} title="Bulleted List">• List</ToolbarButton>
          <ToolbarButton type="button" onClick={() => handleToolbar('ol')} title="Numbered List">1. List</ToolbarButton>
          <ToolbarButton type="button" onClick={() => handleToolbar('code')} title="Code Block">{'</>'}</ToolbarButton>
          <ToolbarButton type="button" onClick={() => handleToolbar('quote')} title="Blockquote">❝</ToolbarButton>
          <ToolbarButton type="button" onClick={() => handleToolbar('hr')} title="Horizontal Rule">―</ToolbarButton>
          <ToolbarButton type="button" onClick={() => handleToolbar('image')} title="Insert Image" disabled={uploading}>🖼️</ToolbarButton>
          <ToolbarButton type="button" onClick={() => setShowPreview(v => !v)}>{showPreview ? 'Edit' : 'Preview'}</ToolbarButton>
        </Toolbar>
        {showPreview ? (
          <div style={{ background: '#f7faff', border: '2px solid #a1c4fd', borderRadius: 10, padding: 16, minHeight: 160, marginBottom: 16 }}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            placeholder="Write your post in Markdown!"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={10}
            style={{ width: '100%', borderRadius: 10, border: '2px solid #a1c4fd', fontSize: 16, padding: 12, background: '#f7faff', fontFamily: 'Comic Sans MS, Comic Sans, cursive', marginBottom: 16 }}
          />
        )}
        <FieldLabel>Excerpt <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span></FieldLabel>
        <Excerpt placeholder="Brief description of your post..." value={excerpt} onChange={e => setExcerpt(e.target.value)} />
        <PublishRow>
          <PublishButton type="submit">📄 {editing ? 'Update' : 'Publish'} Post</PublishButton>
          <PreviewButton type="button" onClick={() => setShowPreview(v => !v)}>{showPreview ? 'Edit' : 'Preview'}</PreviewButton>
        </PublishRow>
        {uploading && <div style={{ color: '#43e97b', marginTop: 12 }}>Uploading image...</div>}
      </form>
    </CardContainer>
  );
}

function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/loginUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        setError('Invalid credentials!');
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.token) {
        setError('Invalid credentials!');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', username);
      setUser(username);
      navigate('/');
    } catch (err) {
      console.log(err);
      setError('Login failed.');
    }
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CartoonCard style={{ maxWidth: 340, width: '100%', margin: '2rem auto', position: 'relative', zIndex: 2 }}>
        <CartoonLock>
          <div className="lock-shackle" />
          <div className="lock-body" />
          <div className="lock-keyhole">
            <div className="lock-keyhole-dot" />
          </div>
        </CartoonLock>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h2 style={{ textAlign: 'center', color: 'var(--cartoon-coral)', fontFamily: 'Permanent Marker, Fredoka One, cursive', marginBottom: 8 }}>Login</h2>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              fontSize: 18,
              padding: '10px 14px',
              borderRadius: 12,
              border: '2px solid var(--cartoon-coral)',
              outline: 'none',
              background: '#fff9e6',
              color: 'var(--cartoon-navy)',
              fontFamily: 'Comic Sans MS, Comic Sans, cursive',
              marginBottom: 4
            }}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              fontSize: 18,
              padding: '10px 14px',
              borderRadius: 12,
              border: '2px solid var(--cartoon-coral)',
              outline: 'none',
              background: '#fff9e6',
              color: 'var(--cartoon-navy)',
              fontFamily: 'Comic Sans MS, Comic Sans, cursive',
              marginBottom: 4
            }}
          />
          {error && <div style={{ color: 'var(--cartoon-coral)', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
          <FunkyButton type="submit" style={{ margin: '0 auto', minWidth: 120 }}>Login</FunkyButton>
        </form>
      </CartoonCard>
    </div>
  );
}

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  React.useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);
  // For demo, views/comments/published are static or zero
  const totalPosts = posts.length;
  const totalViews = 0;
  const totalComments = 0;
  const totalPublished = posts.length; // All posts are published in this demo
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 0' }}>
      <AdminTitle>Admin Dashboard <span role="img" aria-label="rocket">🚀</span></AdminTitle>
      <AdminWelcome>
        Welcome back, creative genius! Time to make some magic <span role="img" aria-label="sparkles">✨</span>
      </AdminWelcome>
      <CreatePostButton as={Link} to="/new">+ Create New Post</CreatePostButton>
      <StatGrid>
        <StatCard style={{ borderColor: '#4ec6ff' }}>
          <StatIcon><span role="img" aria-label="posts">📄</span></StatIcon>
          <StatValue>{totalPosts}</StatValue>
          <StatLabel>Total Posts</StatLabel>
        </StatCard>
        <StatCard style={{ borderColor: '#e17cff' }}>
          <StatIcon><span role="img" aria-label="views">👁️</span></StatIcon>
          <StatValue>{totalViews}</StatValue>
          <StatLabel>Total Views</StatLabel>
        </StatCard>
        <StatCard style={{ borderColor: '#43e97b' }}>
          <StatIcon><span role="img" aria-label="comments">💬</span></StatIcon>
          <StatValue>{totalComments}</StatValue>
          <StatLabel>Comments</StatLabel>
        </StatCard>
        <StatCard style={{ borderColor: '#ff8c61' }}>
          <StatIcon><span role="img" aria-label="published">📊</span></StatIcon>
          <StatValue>{totalPublished}</StatValue>
          <StatLabel>Published</StatLabel>
        </StatCard>
      </StatGrid>
      <AdminSection>
        <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 12, color: 'var(--cartoon-purple)' }}>
          <span role="img" aria-label="settings">⚙️</span> Manage Posts <span role="img" aria-label="edit">📝</span>
        </div>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: 48, color: '#888' }}><span role="img" aria-label="no posts">📄</span></div>
            <div style={{ fontWeight: 'bold', fontSize: 22, margin: '1rem 0 0.5rem 0', fontFamily: 'Permanent Marker, Fredoka One, cursive' }}>No posts yet!</div>
            <div style={{ color: '#888', marginBottom: 16 }}>Create your first amazing post!</div>
            <CreatePostButton as={Link} to="/new">+ Create First Post</CreatePostButton>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {posts.map(post => (
              <li key={post.id} style={{ marginBottom: 18, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #ff61a622', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--cartoon-coral)', fontSize: 18 }}>{post.title}</span>
                  <span style={{ color: '#888', fontSize: 14, marginLeft: 12 }}>{new Date(post.date).toLocaleString()}</span>
                </div>
                <div>
                  <FunkyButton as={Link} to={`/post/${post.id}`} style={{ marginRight: 8 }}>View</FunkyButton>
                  <FunkyButton as={Link} to={`/edit/${post.id}`}>Edit</FunkyButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminSection>
    </div>
  );
}

function FunkyHeaderWithAdmin({ user }) {
  const navigate = useNavigate();
  return (
    <FunkyHeader>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '2rem' }}>DW Developer's Blog</Link>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', marginRight: 16 }}>Home</Link>
        {user && <AdminButton as={Link} to="/admin">Admin</AdminButton>}
        <AuthStatus />
      </div>
    </FunkyHeader>
  );
}

// SearchBar component
function SearchBar({ value, onChange, onSubmit }) {
  return (
    <SearchBarWrapper>
      <SearchBarBox onSubmit={onSubmit}>
        <span style={{ fontSize: 22, color: '#a1c4fd', marginRight: 8 }}>🔍</span>
        <SearchInput
          type="text"
          placeholder="Search for amazing posts, topics, or tags..."
          value={value}
          onChange={onChange}
        />
        <SearchButton type="submit">Search</SearchButton>
      </SearchBarBox>
    </SearchBarWrapper>
  );
}

// Helper functions for comments
function getComments(postId) {
  return JSON.parse(localStorage.getItem('comments_' + postId) || '[]');
}
function saveComments(postId, comments) {
  localStorage.setItem('comments_' + postId, JSON.stringify(comments));
}

// Add guest ID helper
function getOrCreateGuestId() {
  let id = localStorage.getItem('guest_id');
  if (!id) {
    id = 'Guest #' + Math.random().toString(36).substr(2, 6).toUpperCase();
    localStorage.setItem('guest_id', id);
  }
  return id;
}

export default App;
