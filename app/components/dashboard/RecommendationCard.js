'use client';

import styled from 'styled-components';
import Link from 'next/link'; 

const PlaceDescription = styled.p`
  /* --- 1. Define all animation variables here --- */
  --transition-in-duration: 0.4s;
  --transition-in-ease: ease-in;
  --transition-in-delay: 0.1s;
  
  --transition-out-duration: 0.2s;
  --transition-out-ease: ease-out;

  /* --- 2. Set the default ('rest') state --- */
  font-size: 0.9rem;
  font-weight: 400;
  margin-top: 0.5rem;
  line-height: 1.4;
  overflow: hidden;
  opacity: 0;
  transform: translateY(10px);
  max-height: 0px;

  /* --- 3. Define the 'mouse out' transition --- */
  transition: opacity var(--transition-out-duration) var(--transition-out-ease),
              transform var(--transition-out-duration) var(--transition-out-ease),
              max-height var(--transition-out-duration) var(--transition-out-ease);
`;

const CardWrapper = styled.div`
  /* --- 1. Define animation variables here --- */
  --hover-scale: 1.10;
  --scale-transition-timing: 0.4s;
  --scale-transition-ease: cubic-bezier(0.175, 0.885, 0.32, 1.275);

  /* --- 2. Set the default ('rest') state --- */
  position: relative;
  min-width: 360px;
  height: 240px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  background-image: url(${props => props.$imageUrl});
  transform: scale(1);
  transition: transform var(--scale-transition-timing) var(--scale-transition-ease);

  /* --- 3. Define the 'hover' state for the card --- */
  &:hover {
    transform: scale(var(--hover-scale));
  }

  /* --- 4. Define the 'hover' state for the child description --- */
  &:hover ${PlaceDescription} {
    opacity: 1;
    transform: translateY(0);
    max-height: 100px;
    
    /* Use the 'mouse in' variables for the transition */
    transition: opacity var(--transition-in-duration) var(--transition-in-ease) var(--transition-in-delay),
                transform var(--transition-in-duration) var(--transition-in-ease) var(--transition-in-delay),
                max-height var(--transition-in-duration) var(--transition-in-ease) var(--transition-in-delay);
  }
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 20%, transparent 100%);
  display: flex;
  align-items: flex-end;
  padding: 1.25rem;
`;

const Content = styled.div`
  color: #fff;
  width: 100%;
`;

const PlaceName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

export default function RecommendationCard({ name, description, imageUrl, alt }) {
  return (
    <Link 
      href={`/dashboard?destination=${encodeURIComponent(name)}`} 
      style={{ textDecoration: 'none' }}
    >
      <CardWrapper $imageUrl={imageUrl}>
        <Overlay>
          <Content>
            <PlaceName>{name}</PlaceName>
            <PlaceDescription>
              {description}
            </PlaceDescription>
          </Content>
        </Overlay>
      </CardWrapper>
    </Link>
  );
}