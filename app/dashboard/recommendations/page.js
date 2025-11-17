'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';

import RecommendationCard from '@/components/dashboard/RecommendationCard';
import GeneratingAnimation from '@/components/dashboard/GeneratingAnimation';

const LOCAL_STORAGE_KEY = 'wanderiq_saved_trips';

const PageWrapper = styled(motion.div)`
  width: 100%;
  height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 2rem 0 2rem 2rem; 
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const Header = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 1rem; // This padding is essential to see the scale effect
  margin-right: 2rem;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: var(--background-secondary);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--primary-accent);
    border-radius: 4px;
  }
`;

const CenteredContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* MODIFIED: Give the container a defined height to fill the page */
  height: calc(100vh - 100px);
`;

export default function RecommendationsPage() {
  const [data, setData] = useState({ recommended: [], trending: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedTripsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        const storedTrips = storedTripsRaw ? JSON.parse(storedTripsRaw) : [];
        const savedDestinations = storedTrips.map(trip => trip.destination);
        const response = await axios.post('/api/recommendations', { 
          savedDestinations: savedDestinations 
        });
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError("Could not load recommendations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <CenteredContainer>
        <GeneratingAnimation 
          text="Finding new adventures for you..."
          subText="Analyzing your saved trips to recommend new and trending destinations."
        />
      </CenteredContainer>
    );
  }

  if (error) {
    return <CenteredContainer><h2>{error}</h2></CenteredContainer>;
  }

  return (
    <PageWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Section>
        <Header>Recommended For You</Header>
        <ScrollContainer>
          {data.recommended.map((place) => (
            <RecommendationCard key={place.name} {...place} />
          ))}
        </ScrollContainer>
      </Section>

      <Section>
        <Header>Trending Places to Visit</Header>
        <ScrollContainer>
          {data.trending.map((place) => (
            <RecommendationCard key={place.name} {...place} />
          ))}
        </ScrollContainer>
      </Section>
    </PageWrapper>
  );
}