'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import SavedTripCard from '@/components/dashboard/SavedTripCard';
import { useAuth } from '@/components/providers/AuthProvider';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';

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
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { user } = useAuth(); 

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            try {
                if (user) {
                    const tripsRef = collection(db, 'users', user.uid, 'trips');
                    const q = query(tripsRef);
                    const querySnapshot = await getDocs(q);
                    const firestoreTrips = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        savedId: parseInt(doc.id) || doc.id 
                    }));
                    
                    const sortedTrips = firestoreTrips.sort((a, b) => b.savedId - a.savedId);
                    setTrips(sortedTrips);
                } else {
                    const storedTripsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
                    if (storedTripsRaw) {
                        const parsedTrips = JSON.parse(storedTripsRaw);
                        const sortedTrips = parsedTrips.sort((a, b) => b.savedId - a.savedId);
                        setTrips(sortedTrips);
                    } else {
                        setTrips([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching trips:", error);
                toast.error("Failed to load saved trips.");
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [user]);

    const handleDeleteTrip = async (tripIdToDelete) => {
        try {
            if (user) {
                await deleteDoc(doc(db, 'users', user.uid, 'trips', tripIdToDelete.toString()));
            } else {
                const updatedTrips = trips.filter(trip => trip.savedId !== tripIdToDelete);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTrips));
            }

            setTrips(prev => prev.filter(t => t.savedId !== tripIdToDelete));
            toast.success("Trip deleted.");
        } catch (error) {
            console.error("Error deleting trip:", error);
            toast.error("Failed to delete trip.");
        }
    };

    const handleEditTrip = (tripId) => {
        router.push(`/dashboard?editTripId=${tripId}`);
    };

    if (loading) return <PageWrapper><p>Loading trips...</p></PageWrapper>;

    return (
        <PageWrapper>
            <Title>Saved Trips {user ? '(Synced)' : '(Guest)'}</Title>
            {trips.length > 0 ? (
                <TripsList>
                    {trips.map(trip => (
                        <SavedTripCard 
                            key={trip.savedId} 
                            trip={trip} 
                            onDelete={() => handleDeleteTrip(trip.savedId)} 
                            onEdit={() => handleEditTrip(trip.savedId)} 
                        />
                    ))}
                </TripsList>
            ) : (
                <p>You have no saved trips yet.</p>
            )}
        </PageWrapper>
    );
}