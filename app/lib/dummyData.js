export const getDummyItinerary = (inputs) => ({
  destination: inputs.destination || "Paris",
  startDate: inputs.startDate || "2025-10-15",
  endDate: inputs.endDate || "2025-10-18",
  travelers: inputs.travelers || 2,
  budget: inputs.budget || "Moderate",
  interests: inputs.interests || "museums, art",
  summary: "A fallback itinerary for Paris, focusing on iconic landmarks and cultural experiences.",
  image: "https://images.unsplash.com/photo-1502602898657-3e91760c0341?q=80&w=2070&auto=format&fit=crop",
  days: [
    {
      id: 1,
      date: inputs.startDate || "2025-10-15",
      activities: [
        { id: 101, time: "09:00", activity: "Visit the Louvre Museum", location: "Louvre Museum", type: "culture" },
        { id: 102, time: "13:00", activity: "Lunch near Tuileries Garden", location: "Tuileries Garden", type: "food" },
        { id: 103, time: "15:00", activity: "Walk along the Seine", location: "River Seine", type: "sightseeing" },
        { id: 104, time: "19:00", activity: "Dinner in Le Marais", location: "Le Marais", type: "food" },
      ]
    },
    {
      id: 2,
      date: "2025-10-16",
      activities: [
        { id: 201, time: "10:00", activity: "Eiffel Tower Summit", location: "Eiffel Tower", type: "sightseeing" },
        { id: 202, time: "14:00", activity: "Explore Montmartre", location: "Montmartre", type: "culture" },
        { id: 203, time: "18:00", activity: "Sunset at Sacré-Cœur", location: "Sacré-Cœur Basilica", type: "relax" },
      ]
    }
  ],
  budgetDetails: [
      { id: 1, category: "Flights", amount: 1200 },
      { id: 2, category: "Accommodation", amount: 800 },
      { id: 3, category: "Activities & Food", amount: 600 },
  ],
  warning: 'AI fallback used'
});

export const getDummyFlights = () => ([
  {
    id: 1,
    airline: "Air France",
    flightNumber: "AF123",
    departure: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    arrival: new Date(Date.now() + (2 * 24 + 8) * 60 * 60 * 1000).toISOString(),
    duration: "8h 0m",
    price: 650,
    currency: "USD",
    stops: 0,
    meta: { type: 'dummy' }
  },
  {
    id: 2,
    airline: "Lufthansa",
    flightNumber: "LH456",
    departure: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    arrival: new Date(Date.now() + (2 * 24 + 11) * 60 * 60 * 1000).toISOString(),
    duration: "11h 0m",
    price: 580,
    currency: "USD",
    stops: 1,
    meta: { type: 'dummy' }
  }
]);
