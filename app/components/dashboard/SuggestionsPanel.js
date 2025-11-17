'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plane, ExternalLink } from 'lucide-react';

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
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Adjusted gap */

  h4 {
    font-weight: 600;
    margin: 0;
  }
  p {
    color: var(--secondary);
    margin: 0;
    font-size: 0.85rem;
  }

  box-shadow: 0 0 3px #4a4a4aff;
  overflow: visible; 
  margin: 3px
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceText = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--foreground) !important;
`;

const BookButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: var(--primary);
  color: var(--secondary);
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-hover);
  }
`;

const HorizontalLine = styled.hr`
  border: none;
  border-top: 1px solid var(--border);
  margin: 0.25rem 0;
`;

const FlightDetailsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0.75rem;
`;

const DetailColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
`;

const VerticalLine = styled.div`
    width: 1px;
    height: 100%;
    background-color: var(--border);
`;

const DetailLabel = styled.span`
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--foreground);
`;

const TimeInfo = styled.p`
    font-weight: 500;
`;

export default function SuggestionsPanel({ flights }) {
  return (
    <PanelWrapper>
      <SuggestionSection>
        <SectionHeader>Flight Suggestions</SectionHeader>
        {Array.isArray(flights) && flights.length > 0 ? flights.map((flight, index) => (
          <SuggestionCard key={flight.id || index} initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: index * 0.1}}>
            <CardRow>
              <h4><strong>{flight.airline}</strong></h4>
              <PriceText>₹{flight.price.toLocaleString('en-IN')}</PriceText>
            </CardRow>

            <HorizontalLine />
            
            <FlightDetailsGrid>
                <DetailColumn>
                    <DetailLabel>Outbound</DetailLabel>
                    <TimeInfo>{flight.outboundDeparture} → {flight.outboundArrival}</TimeInfo>
                    <p>{flight.outboundDuration} · {flight.outboundStops} stop(s)</p>
                </DetailColumn>
                <VerticalLine />
                <DetailColumn>
                    <DetailLabel>Inbound</DetailLabel>
                    <TimeInfo>{flight.inboundDeparture} → {flight.inboundArrival}</TimeInfo>
                    <p>{flight.inboundDuration} · {flight.inboundStops} stop(s)</p>
                </DetailColumn>
            </FlightDetailsGrid>

            <BookButton href={flight.bookingUrl} target="_blank" rel="noopener noreferrer">
              Flight Details <ExternalLink size={14} />
            </BookButton>
          </SuggestionCard>
        )) : <p>No flight suggestions found for this trip.</p>}
      </SuggestionSection>
    </PanelWrapper>
  );
}