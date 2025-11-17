'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';

const LOCAL_STORAGE_KEY = 'wanderiq_saved_trips';

export const useItinerary = () => {
    const [itinerary, setItinerary] = useState(null);
    const [flightSuggestions, setFlightSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 

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
            console.log("flight done ig");
            console.log(flightsResponse.data);

            return itineraryData;

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message;
            setError(errorMessage);
            console.error("Error during itinerary generation:", err);
            setItinerary(null);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false); 
        }
    }, []);

    const applyUpdatedItinerary = useCallback((newItinerary) => {
        setItinerary(newItinerary);
    }, []);
    
    const saveCurrentItinerary = useCallback(() => {
        if (!itinerary) {
            alert('No itinerary to save.');
            return;
        }

        try {
            const storedTripsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
            const storedTrips = storedTripsRaw ? JSON.parse(storedTripsRaw) : [];
            
            const newItineraryToSave = {
                ...itinerary,
                savedId: Date.now()
            };

            const updatedTrips = [...storedTrips, newItineraryToSave];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTrips));
            alert('Trip saved successfully!');
        } catch (error) {
            console.error("Failed to save trip:", error);
            alert('Failed to save trip. Check the console for details.');
        }
    }, [itinerary]);


    return { 
        itinerary, 
        flightSuggestions, 
        error, 
        isLoading, 
        generateItinerary, 
        applyUpdatedItinerary,
        saveCurrentItinerary
    };
};