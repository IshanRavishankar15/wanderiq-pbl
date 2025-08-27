'use client';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Trash2, Download, Upload } from 'lucide-react';

const TripsWrapper = styled.div`
  padding: 1rem;
`;


const TripsList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TripCard = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow-elevation-low);
`;

const TripInfo = styled.div`
  p {
    font-size: 0.9rem;
    color: var(--secondary);
  }
`;

const TripActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--secondary);
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: var(--border);
    color: var(--foreground);
  }
`;


/**
 * Component to display, load, and delete previous trips from localStorage.
 */
export default function PreviousTrips() {
    const [trips, setTrips] = useState([]);
    const LOCAL_STORAGE_KEY = 'ai_travel_previous_trips';

    useEffect(() => {
        const storedTrips = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedTrips) {
            setTrips(JSON.parse(storedTrips));
        }
    }, []);

    const handleDelete = (indexToDelete) => {
        const updatedTrips = trips.filter((_, index) => index !== indexToDelete);
        setTrips(updatedTrips);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTrips));
    };
    
    // ... implement load and export functions

    return (
        <TripsWrapper>
            {trips.length > 0 ? (
                <TripsList>
                    {trips.map((trip, index) => (
                        <TripCard key={index}>
                            <TripInfo>
                                <h3>{trip.destination}</h3>
                                <p>{trip.startDate} to {trip.endDate}</p>
                            </TripInfo>
                            <TripActions>
                                <ActionButton title="Load"><Upload size={18} /></ActionButton>
                                <ActionButton title="Export"><Download size={18} /></ActionButton>
                                <ActionButton title="Delete" onClick={() => handleDelete(index)}><Trash2 size={18} /></ActionButton>
                            </TripActions>
                        </TripCard>
                    ))}
                </TripsList>
            ) : (
                <p>You have no saved trips yet.</p>
            )}
        </TripsWrapper>
    );
}