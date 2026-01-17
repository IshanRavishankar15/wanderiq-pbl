'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation'; 
import SavedTripCard from '@/components/dashboard/SavedTripCard';

const PageWrapper = styled.div`
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const TripsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
`;

const LOCAL_STORAGE_KEY = 'wanderiq_saved_trips';

export default function SavedTripsPage() {
    const [trips, setTrips] = useState([]);
    const router = useRouter(); 

    useEffect(() => {
        const storedTripsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedTripsRaw) {
            const parsedTrips = JSON.parse(storedTripsRaw);
            const sortedTrips = parsedTrips.sort((a, b) => b.savedId - a.savedId);
            setTrips(sortedTrips);
        }
    }, []);

    const handleDeleteTrip = (tripIdToDelete) => {
        const updatedTrips = trips.filter(trip => trip.savedId !== tripIdToDelete);
        setTrips(updatedTrips);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTrips));
    };

    const handleEditTrip = (tripId) => {
        router.push(`/dashboard?editTripId=${tripId}`);
    };

    return (
        <PageWrapper>
            <Title>Saved Trips</Title>
            {trips.length > 0 ? (
                <TripsList>
                    {trips.map(trip => (
                        <SavedTripCard 
                            key={trip.savedId} 
                            trip={trip} 
                            onDelete={() => handleDeleteTrip(trip.savedId)} 
                            onEdit={() => handleEditTrip(trip.savedId)} // MODIFIED: Pass onEdit handler
                        />
                    ))}
                </TripsList>
            ) : (
                <p>You have no saved trips yet.</p>
            )}
        </PageWrapper>
    );
}