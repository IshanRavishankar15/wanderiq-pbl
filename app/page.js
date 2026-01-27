'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, LogIn, Mail, Lock, User, Chrome, ArrowRight } from 'lucide-react';
import { Ubuntu } from 'next/font/google';
import { useAuth } from '@/components/providers/AuthProvider';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const BACKGROUND_IMAGES = [
  "/wanderiq_bg1.png",
  "/wanderiq_bg2.png",
  "/wanderiq_bg3.png"
];

const LandingContainer = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  color: white; 
  overflow: hidden;
`;

const BackgroundLayer = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: -2;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgba(0, 0, 0, 0.48);
`;

const Title = styled(motion.h1)`
  position: relative;
  z-index: 1;
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -0.05em;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  position: relative;
  z-index: 1;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const AuthCard = styled(motion.div)`
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 2rem;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  color: white;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1rem;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    pointer-events: none;
    opacity: 0.8;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    border-color: #d946ef;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 0 2px rgba(217, 70, 239, 0.2);
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  margin-top: 0.5rem;
  border-radius: 12px;
  background: linear-gradient(to right, #a855f7, #d946ef);
  border: none;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  &:active {
    transform: scale(0.98);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const GoogleButton = styled(PrimaryButton)`
  background: white;
  color: #333;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  
  &:hover {
    background: #f0f0f0;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }
  span {
    padding: 0 10px;
  }
`;

const ToggleText = styled.p`
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  
  button {
    background: none;
    border: none;
    color: white;
    font-weight: 700;
    cursor: pointer;
    text-decoration: underline;
    margin-left: 0.5rem;
  }
`;

const GuestLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: white;
  }
`;

export default function LandingPage() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginMode) {
        await loginWithEmail(email, password);
      } else {
        if (!name) {
            toast.error("Please enter your name");
            setLoading(false);
            return;
        }
        await registerWithEmail(email, password, name);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <LandingContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <AnimatePresence>
        <BackgroundLayer
          key={bgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }} 
          style={{ backgroundImage: `url(${BACKGROUND_IMAGES[bgIndex]})` }}
        />
      </AnimatePresence>
      
      <Overlay />

      <Title
        className={ubuntu.className}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Plane size={48} color="#d946ef"/>
        WanderIQ
      </Title>
      
      <Subtitle
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Your personal AI trip-planner.
      </Subtitle>

      <AuthCard
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <InputGroup>
              <User size={18} />
              <Input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLoginMode}
              />
            </InputGroup>
          )}

          <InputGroup>
            <Mail size={18} />
            <Input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Lock size={18} />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </InputGroup>

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isLoginMode ? 'Log In' : 'Sign Up')} 
            <LogIn size={18} />
          </PrimaryButton>
        </form>

        <Divider><span>OR</span></Divider>

        <GoogleButton onClick={loginWithGoogle} type="button">
           <Chrome size={18} /> Continue with Google
        </GoogleButton>

        <ToggleText>
          {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? 'Sign Up' : 'Log In'}
          </button>
        </ToggleText>

        <GuestLink href="/dashboard">
          Continue as Guest <ArrowRight size={16} />
        </GuestLink>
      </AuthCard>
    </LandingContainer>
  );
}