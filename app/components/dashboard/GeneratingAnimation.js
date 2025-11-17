'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plane, Map, Compass } from 'lucide-react';

const AnimationWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  color: var(--foreground);
  text-align: center;
  position: relative;
  overflow: hidden;
  /* MODIFIED: Changed height to be less restrictive than 100vh */
  height: 400px;
`;

const PlaneIcon = styled(motion.div)`
  color="#9333ea";
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 15px #9333ea);
`;

const LoadingText = styled(motion.h2)`
  font-size: 1.5rem;
  font-weight: 600;
`;

const SubText = styled(motion.p)`
  font-size: 1rem;
  color: var(--secondary);
  max-width: 300px;
`;

const IconsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  color: var(--secondary);
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function GeneratingAnimation({
  text = "Crafting Your Adventure...",
  subText = "Our AI is exploring destinations, planning activities, and optimizing your schedule."
}) {
  return (
    <AnimationWrapper>
      <PlaneIcon
        animate={{
          scale: [1, 1.15, 1],
          filter: [
            'drop-shadow(0 0 15px #9333ea)',
            'drop-shadow(0 0 15px #9333ea)',
            'drop-shadow(0 0 15px #9333ea)',
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Plane size={60} color="#9333ea"/>
      </PlaneIcon>

      <LoadingText
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: 0.3,
          duration: 1,
          ease: "easeOut",
        }}
        style={{ marginTop: 0 }}
      >
        {text}
      </LoadingText>

      <SubText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.6,
          duration: 1,
          ease: "easeOut",
        }}
      >
        {subText}
      </SubText>

      <IconsContainer>
        <IconWrapper
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Compass size={24} />
        </IconWrapper>

        <IconWrapper
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Map size={24} />
        </IconWrapper>
      </IconsContainer>
    </AnimationWrapper>
  );
}