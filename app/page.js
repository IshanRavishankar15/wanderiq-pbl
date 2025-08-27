'use client';

import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowRight, Plane } from 'lucide-react';
import { Ubuntu } from 'next/font/google';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '700'],
});

/* Keyframes for background animation */
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

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

  /* Animated Gradient Background */
  background: linear-gradient(
    300deg,
    #0d0124,
    #1a0251,
    #3d1e78,
    #1a0251,
    #0d0124
  );
  background-size: 300% 300%;
  animation: ${gradientShift} 8s ease infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0) 60%
    );
    pointer-events: none;
    z-index: 0; /* Keep overlay behind text */
  }
`;

const Title = styled(motion.h1)`
  position: relative;
  z-index: 1; /* Bring text above overlay */
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.05em;
  color: #d1c4e9;

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const Subtitle = styled(motion.p)`
  position: relative;
  z-index: 1; /* Bring text above overlay */
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  max-width: 600px;
  color: #d1c4e9;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const CTAButton = styled(motion.button)`
  position: relative;
  z-index: 1; /* Keep button above overlay */
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 50px;
  background-image: linear-gradient(
    to right,
    #a855f7 0%,
    #d946ef 51%,
    #a855f7 100%
  );
  background-size: 200% auto;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(168, 85, 247, 0.5);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    background-position: right center;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(168, 85, 247, 0.7);
  }
`;

export default function LandingPage() {
  return (
    <LandingContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Title
        className={ubuntu.className}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.5,
        }}
      >
        <Plane size={54} color="var(--primary)"/>
        WanderIQ
      </Title>
      
      <Subtitle
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.97,
        }}
      >
        Your personal AI trip-planner. 
      </Subtitle>
      <Link href="/dashboard" passHref>
        <CTAButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span>Create Your Itinerary</span>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{
              x: 5,
              transition: { type: 'spring', stiffness: 400, damping: 10 },
            }}
          >
            <ArrowRight size={20} />
          </motion.div>
        </CTAButton>
      </Link>
    </LandingContainer>
  );
}
