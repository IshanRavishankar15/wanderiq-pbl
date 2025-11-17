'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MapPin, Clock, Sun, Utensils, Camera, Bed, Compass, Plane, Map as MapIcon, Car } from 'lucide-react';

const ItineraryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ItineraryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ItineraryTitle = styled.h2``;

const SaveButton = styled.button`
  margin-top: 1px;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  font-size: 0.93rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: var(--primary-hover);
  }
`;

const DayCard = styled(motion.div)`
  background-color: var(--card-background);
  border: 1px solid var(--primary);
  border-radius: 12px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    box-shadow: 0 0 6px black;
    pointer-events: none;
  }
`;

const ImageHeader = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background-color: var(--border);
  background-image: url(${props => props.$imageUrl || 'none'});
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0.75rem 1rem;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => 
        props.$uiMode === 'dark' 
            ? 'linear-gradient(to top, rgba(26,16,44,1) 0%, rgba(26,16,44,0.7) 30%, transparent 100%)'
            : 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 30%, transparent 100%)'
    };
  }
`;

const HeaderOverlay = styled.div`
  position: relative;
  z-index: 2;
  color: ${props => props.$uiMode === 'dark' ? 'var(--foreground-dark)' : 'var(--foreground-light)'};
  text-shadow: 1px 1px 3px ${props => props.$uiMode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'};
`;

const DayNumber = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
`;

const DayDate = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: inherit !important;
`;

const LocationLink = styled.a`
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary);
  }
`;

const InfoRow = styled.small`
  color: var(--secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 4px;
`;

const WeatherInfo = styled(InfoRow)`
  font-size: 0.8rem;
`;

const TravelInfo = styled(InfoRow)`
  color: var(--secondary-muted);
  font-style: italic;
  font-size: 0.8rem;
`;

const ActivitiesList = styled.ul`list-style: none; padding: 1rem;`;
const ActivityItem = styled.li`display: flex; gap: 1rem; padding: 1rem 0.5rem; border-bottom: 1px solid var(--border); &:last-child { border-bottom: none; }`;
const ActivityIcon = styled.div`color: var(--primary);`;
const ActivityDetails = styled.div`flex-grow: 1; p { font-weight: 500; } small { color: var(--secondary); display: flex; align-items: center; gap: 0.25rem; }`;

const ActivityTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  font-weight: 600;
  color: var(--secondary);
  text-align: right;
  /* Ensure it doesn't shrink */
  flex-shrink: 0;
  white-space: nowrap;
`;

const activityIcons = {
    sightseeing: <Camera size={20} />, culture: <MapIcon size={20} />, food: <Utensils size={20} />,
    relax: <Bed size={20} />, adventure: <Compass size={20} />, transport: <Plane size={20} />, other: <Sun size={20} />,
};

export default function ItineraryDisplay({ itinerary, onSaveTrip, uiMode }) {
  if (!itinerary?.days) return null;

  return (
    <ItineraryWrapper>
      <ItineraryHeader>
        <ItineraryTitle>Your Trip to {itinerary.destination}</ItineraryTitle>
        <SaveButton onClick={onSaveTrip}>Save Trip</SaveButton>
      </ItineraryHeader>

      {itinerary.days.map((day, index) => (
        <DayCard
          key={day.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <ImageHeader $imageUrl={day.imageUrl} $uiMode={uiMode}>
              <HeaderOverlay $uiMode={uiMode}>
                  <DayNumber>Day {index + 1}</DayNumber>
                  <DayDate>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</DayDate>
              </HeaderOverlay>
          </ImageHeader>

          <ActivitiesList>
            {day.activities.map(activity => (
              <ActivityItem key={activity.id}>
                <ActivityIcon>{activityIcons[activity.type] || <Sun size={20}/>}</ActivityIcon>
                <ActivityDetails>
                  <p>{activity.activity}</p>
                  <InfoRow>
                    <MapPin size={12} /> 
                    <LocationLink 
                      href={`https://www.google.com/search?q=${encodeURIComponent(activity.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {activity.location}
                    </LocationLink>
                  </InfoRow>
                  
                  {activity.travelToNext && (
                    <TravelInfo>
                      <Car size={12} />
                      {activity.travelToNext.distance} &bull; {activity.travelToNext.time} to next destination.
                    </TravelInfo>
                  )}
                </ActivityDetails>
                
                <ActivityTime>
                  <div>
                    <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> 
                    {activity.time}
                  </div>
                  {activity.weather && (
                    <WeatherInfo>
                      {activity.weather}
                    </WeatherInfo>
                  )}
                </ActivityTime>
              </ActivityItem>
            ))}
          </ActivitiesList>
        </DayCard>
      ))}
    </ItineraryWrapper>
  );
}