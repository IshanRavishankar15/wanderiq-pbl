'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion'; 
import { ChevronDown, Trash2, Edit, MapPin, Clock, Sun, Utensils, Camera, Bed, Compass, Plane, Map as MapIcon, Car } from 'lucide-react';

const CardWrapper = styled(motion.div)`
  background-color: var(--card-background);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 0 6px black;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: var(--foreground);
  font-size: 1rem;

  &:hover {
    background-color: color-mix(in srgb, var(--card-background) 90%, white 5%);
    border-radius: 12px;
  }
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const ChevronIcon = styled.div`
  transition: transform 0.2s ease-in-out;
  transform: rotate(${props => props.$isOpen ? '90deg' : '0deg'});
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: none;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  color: var(--secondary);
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: ${props => props.$danger ? '#ef4444' : 'var(--primary)'};
    background-color: var(--border);
  }

  &:disabled {
    color: #6b7280;
    cursor: not-allowed;
    background-color: transparent;
  }
`;

const ItineraryContent = styled(motion.div)`
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid var(--border);
  overflow: hidden;
`;

const DayCard = styled.div`
  margin-top: 1rem;
`;
const DayHeader = styled.div`
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
  h3 { font-size: 1.1rem; }
  p { color: var(--secondary); font-size: 0.9rem; }
`;
const ActivitiesList = styled.ul`
  list-style: none;
  padding: 0.5rem 0;
`;
const ActivityItem = styled.li`
  display: flex;
  gap: 1rem;
  padding: 0.75rem 0;
`;
const ActivityIcon = styled.div` color: var(--primary); `;
const ActivityDetails = styled.div` flex-grow: 1; p { font-weight: 500; } small { color: var(--secondary); display: flex; align-items: center; gap: 0.25rem; }`;

const ActivityTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  font-weight: 600;
  color: var(--secondary);
  text-align: right;
  flex-shrink: 0;
  white-space: nowrap;
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


const activityIcons = {
    sightseeing: <Camera size={20} />, culture: <MapIcon size={20} />, food: <Utensils size={20} />,
    relax: <Bed size={20} />, adventure: <Compass size={20} />, transport: <Plane size={20} />, other: <Sun size={20} />,
};

export default function SavedTripCard({ trip, onDelete }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <CardWrapper>
            <CardHeader onClick={() => setIsOpen(!isOpen)}>
                <HeaderTitle>
                    <ChevronIcon $isOpen={isOpen}>
                        <ChevronDown size={24} />
                    </ChevronIcon>
                    Your trip to {trip.destination}
                </HeaderTitle>
                <Actions>
                    <ActionButton disabled title="Modify (coming soon)">
                        <Edit size={18} />
                    </ActionButton>
                    <ActionButton $danger onClick={handleDeleteClick} title="Delete Trip">
                        <Trash2 size={18} />
                    </ActionButton>
                </Actions>
            </CardHeader>
            <AnimatePresence>
                {isOpen && (
                    <ItineraryContent
                        key="content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                        {trip.days.map((day, index) => (
                           <DayCard key={day.id}>
                                <DayHeader>
                                    <h3>Day {index + 1}</h3>
                                    <p>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                </DayHeader>
                                <ActivitiesList>
                                    {day.activities.map(activity => (
                                        <ActivityItem key={activity.id}>
                                            <ActivityIcon>{activityIcons[activity.type] || <Sun size={20} />}</ActivityIcon>
                                            <ActivityDetails>
                                                <p>{activity.activity}</p>
                                                <InfoRow>
                                                  <MapPin size={12} /> {activity.location}
                                                </InfoRow>
                                                {activity.travelToNext && (
                                                  <TravelInfo>
                                                    <Car size={12} />
                                                    {activity.travelToNext.distance} &bull; {activity.travelToNext.time}
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
                    </ItineraryContent>
                )}
            </AnimatePresence>
        </CardWrapper>
    );
}