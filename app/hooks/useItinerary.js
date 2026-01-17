'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/providers/AuthProvider';
import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'wanderiq_saved_trips';

export const useItinerary = () => {
    const { user } = useAuth(); // Access auth state
    const [itinerary, setItinerary] = useState(null);
    const [flightSuggestions, setFlightSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 

    // --- Same Generate Logic as before ---
    const generateItinerary = useCallback(async (inputs) => {
        setIsLoading(true);
        setItinerary(null);
        setError(null);
        setFlightSuggestions([]);

        try {
            const itineraryResponse = await axios.post('/api/generate-itinerary', inputs);
            
            let itineraryData = itineraryResponse.data;

            const itineraryWithImages = await Promise.all(
                itineraryData.days.map(async (day) => {
                    const popularDestinationQuery = day.activities[1]?.activity; 
                    
                    if (popularDestinationQuery) {
                        try {
                            const unsplashResponse = await axios.post('/api/unsplash', { query: popularDestinationQuery });
                            return { ...day, imageUrl: unsplashResponse.data.imageUrl, imageAlt: unsplashResponse.data.altDescription };
                        } catch (imgError) {
                            console.warn(`Could not fetch image for ${popularDestinationQuery}:`, imgError.message);
                            return { ...day, imageUrl: null };
                        }
                    }
                    return { ...day, imageUrl: null };
                })
            );
            itineraryData = { ...itineraryData, days: itineraryWithImages };

            setItinerary(itineraryData);

            const flightsResponse = await axios.post('/api/flights', { 
                destination: inputs.destination, 
                startDate: inputs.startDate,
                endDate: inputs.endDate,
                travelers: inputs.travelers
            });

            setFlightSuggestions(flightsResponse.data);
            
            return itineraryData;

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message;
            setError(errorMessage);
            console.error("Error during itinerary generation:", err);
            toast.error(`Failed to generate: ${errorMessage}`);
            setItinerary(null);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false); 
        }
    }, []);

    const applyUpdatedItinerary = useCallback((newItinerary) => {
        setItinerary(prev => ({
            ...newItinerary,
            savedId: prev?.savedId
        }));
    }, []);
    
    // --- HYBRID SAVE LOGIC ---
    const saveCurrentItinerary = useCallback(async () => {
        if (!itinerary) {
            toast.error('No itinerary to save.');
            return;
        }

        const tripId = itinerary.savedId || Date.now();
        const tripToSave = { ...itinerary, savedId: tripId };

        try {
            if (user) {
                // FIRESTORE SAVE
                // Save to: users/{uid}/trips/{tripId}
                const tripRef = doc(db, 'users', user.uid, 'trips', tripId.toString());
                await setDoc(tripRef, tripToSave);
            } else {
                // LOCAL STORAGE SAVE (Guest)
                const storedTripsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
                let storedTrips = storedTripsRaw ? JSON.parse(storedTripsRaw) : [];
                
                // If editing, remove old version first
                if (itinerary.savedId) {
                    storedTrips = storedTrips.filter(t => t.savedId !== itinerary.savedId);
                }

                const updatedTrips = [...storedTrips, tripToSave];
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTrips));
            }

            // Update local state ID to match saved ID
            setItinerary(prev => ({ ...prev, savedId: tripId }));

            toast.success('Trip saved successfully!', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            
        } catch (error) {
            console.error("Failed to save trip:", error);
            toast.error('Failed to save trip. Please try again.');
        }
    }, [itinerary, user]); // Depend on user state


    return { 
        itinerary, 
        flightSuggestions, 
        error, 
        isLoading, 
        generateItinerary, 
        applyUpdatedItinerary,
        saveCurrentItinerary,
        setItinerary 
    };
};