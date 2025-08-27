// --- components/dashboard/SuggestionsPanel.js ---
'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plane, Building, Star } from 'lucide-react';

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
`;

const SuggestionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionHeader = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
`;

const SuggestionCard = styled(motion.div)`
  background-color: var(--card-background);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.9rem;

  h4 {
    font-weight: 600;
  }
  p {
    color: var(--secondary);
    margin-top: 0.25rem;
  }
`;

/**
 * Displays flight and hotel suggestion cards.
 */
export default function SuggestionsPanel({ flights, hotels }) {
  return (
    <PanelWrapper>
      <SuggestionSection>
        <SectionHeader>✈️ Flight Suggestions</SectionHeader>
        {flights.length > 0 ? flights.map((flight, index) => (
          <SuggestionCard key={flight.id} initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: index * 0.1}}>
            <h4>{flight.airline} - ${flight.price}</h4>
            <p>{flight.stops} stop(s) · {flight.duration}</p>
          </SuggestionCard>
        )) : <p>No flight suggestions available.</p>}
      </SuggestionSection>
      <SuggestionSection>
        <SectionHeader>🏨 Hotel Suggestions</SectionHeader>
        {hotels.length > 0 ? hotels.map((hotel, index) => (
          <SuggestionCard key={hotel.id} initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: (flights.length + index) * 0.1}}>
            <h4>{hotel.name}</h4>
            <p>
                {hotel.rating} <Star size={12} style={{fill: 'gold', color: 'gold'}}/> · ${hotel.pricePerNight}/night
            </p>
          </SuggestionCard>
        )) : <p>No hotel suggestions available.</p>}
      </SuggestionSection>
    </PanelWrapper>
  );
}