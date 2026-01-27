'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion'; 
import { ChevronDown, Trash2, Edit, MapPin, Clock, Sun, Utensils, Camera, Bed, Compass, Plane, Map as MapIcon, Car, Calendar, Users } from 'lucide-react';

const CardWrapper = styled(motion.div)`
  background-color: var(--card-background);
  border: 1px solid var(--border);
  border-radius: 16px; /* Softer corners */
  overflow: hidden; /* Keep image inside */
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    border-color: var(--primary);
  }
`;

// NEW: Image Header Section
const CardImageHeader = styled.div`
  height: 140px;
  background-image: url(${props => props.$bg});
  background-size: cover;
  background-position: center;
  position: relative;
  
  /* Gradient overlay to make text readable */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  }
`;

const HeaderContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem 1.5rem;
  z-index: 2; /* Above gradient */
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const TripTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

const TripMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: rgba(255,255,255,0.8);
  font-size: 0.85rem;
  margin-top: 0.25rem;
  
  span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: white;
    color: var(--primary);
  }

  &.danger:hover {
    background: #ef4444;
    color: white;
    border-color: #ef4444;
  }
`;

const ToggleArea = styled.div`
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  background: var(--card-background);
  border-top: 1px solid var(--border);
  cursor: pointer;
  
  &:hover {
    background: rgba(255,255,255,0.05);
  }
`;

// ... (Keep existing Styled Components for content: ItineraryContent, DayCard, etc.) ...
// Reuse the internal styles from your previous file for the expanded content
const ItineraryContent = styled(motion.div)`
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  background: var(--card-background);
`;

const DayCard = styled.div`
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px solid var(--border);
`;
const DayHeader = styled.div`
  h3 { font-size: 1.1rem; color: var(--foreground); }
  p { color: var(--secondary); font-size: 0.9rem; margin-bottom: 0.5rem;}
`;
const ActivitiesList = styled.ul` list-style: none; padding: 0; `;
const ActivityItem = styled.li` display: flex; gap: 1rem; padding: 0.75rem 0; `;
const ActivityIcon = styled.div` color: var(--primary); min-width: 24px; `;
const ActivityDetails = styled.div` flex-grow: 1; p { font-weight: 500; } small { color: var(--secondary); display: flex; align-items: center; gap: 0.25rem; }`;
const InfoRow = styled.small` color: var(--secondary); display: flex; align-items: center; gap: 0.25rem; margin-top: 4px; `;
const TravelInfo = styled(InfoRow)` color: var(--secondary-muted); font-style: italic; font-size: 0.8rem; `;
const ActivityTime = styled.div` display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem; font-weight: 600; color: var(--secondary); text-align: right; flex-shrink: 0; white-space: nowrap; `;
const WeatherInfo = styled(InfoRow)` font-size: 0.8rem; `;

const activityIcons = {
    sightseeing: <Camera size={20} />, culture: <MapIcon size={20} />, food: <Utensils size={20} />,
    relax: <Bed size={20} />, adventure: <Compass size={20} />, transport: <Plane size={20} />, other: <Sun size={20} />,
};

export default function SavedTripCard({ trip, onDelete, onEdit }) {
    const [isOpen, setIsOpen] = useState(false);
    
    // Fallback image if none exists in the itinerary
    const coverImage = trip.days?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';

    return (
        <CardWrapper layout>
            <CardImageHeader $bg={coverImage}>
                <HeaderContent>
                    <div>
                        <TripTitle>{trip.destination}</TripTitle>
                        <TripMeta>
                            <span><Calendar size={14}/> {trip.days.length} Days</span>
                            <span><Users size={14}/> {trip.travelers} Travelers</span>
                        </TripMeta>
                    </div>
                    <ActionButtons>
                        <IconButton onClick={(e) => { e.stopPropagation(); onEdit(); }} title="Edit">
                            <Edit size={16} />
                        </IconButton>
                        <IconButton className="danger" onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Delete">
                            <Trash2 size={16} />
                        </IconButton>
                    </ActionButtons>
                </HeaderContent>
            </CardImageHeader>

            <ToggleArea onClick={() => setIsOpen(!isOpen)}>
                 <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown size={20} color="var(--secondary)" />
                 </motion.div>
            </ToggleArea>

            <AnimatePresence>
                {isOpen && (
                    <ItineraryContent
                        key="content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
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
                                                <InfoRow><MapPin size={12} /> {activity.location}</InfoRow>
                                                {activity.travelToNext && <TravelInfo><Car size={12} /> {activity.travelToNext.distance}</TravelInfo>}
                                            </ActivityDetails>
                                            <ActivityTime>
                                              <div><Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {activity.time}</div>
                                              {activity.weather && <WeatherInfo>{activity.weather}</WeatherInfo>}
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