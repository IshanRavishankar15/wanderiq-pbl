import { NextResponse } from 'next/server';
import axios from 'axios';
import { getDummyFlights } from '@/lib/dummyData';
import iataData from '@/lib/iata.json';

const formatDuration = (minutes) => {
    if (minutes === undefined || minutes === null) return 'N/A';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};

const formatTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    });
};

export async function POST(request) {
    const apiKey = process.env.FLIGHT_API_KEY;

    if (!apiKey) {
        console.warn("Flight API key not found. Using dummy data.");
        return NextResponse.json(getDummyFlights());
    }

    try {
        const body = await request.json();
    
        const { destination, startDate, endDate, travelers } = body;

        const origin = 'JAI'; 
        const destinationCode = iataData.destination_to_iata[destination];

        if (!destinationCode) {
            console.error(`No IATA code found for destination: ${destination}`);
            return NextResponse.json([]);
        }
        
        const departDate = new Date(startDate).toISOString().split('T')[0];
        const returnDate = new Date(endDate).toISOString().split('T')[0];

        const apiUrl = `https://api.flightapi.io/roundtrip/${apiKey}/${origin}/${destinationCode}/${departDate}/${returnDate}/${travelers}/0/0/Economy/INR`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        const normalizedFlights = data.itineraries.map(itinerary => {
            const cheapestOption = itinerary.pricing_options[0];
            const bookingUrlPath = cheapestOption?.items[0]?.url;
            const outboundLeg = data.legs.find(leg => leg.id === itinerary.leg_ids[0]);
            const returnLeg = data.legs.find(leg => leg.id === itinerary.leg_ids[1]);
            const carrierId = outboundLeg?.marketing_carrier_ids[0];
            const carrier = data.carriers.find(c => c.id === carrierId);

            return {
                id: itinerary.id,
                price: Math.round(itinerary.cheapest_price.amount),
                currency: 'INR',
                airline: carrier?.name || 'Unknown Airline',
                
                outboundStops: outboundLeg?.stop_count || 0,
                outboundDuration: formatDuration(outboundLeg?.duration),
                outboundDeparture: formatTime(outboundLeg?.departure),
                outboundArrival: formatTime(outboundLeg?.arrival),

                inboundStops: returnLeg?.stop_count || 0,
                inboundDuration: formatDuration(returnLeg?.duration),
                inboundDeparture: formatTime(returnLeg?.departure),
                inboundArrival: formatTime(returnLeg?.arrival),

                bookingUrl: `https://www.skyscanner.net${bookingUrlPath}`
            };
        });

        const sortedFlights = normalizedFlights.sort((a, b) => a.price - b.price);

        return NextResponse.json(sortedFlights);

    } catch (error) {
        console.error("Error fetching from Flight API:", error.response?.data || error.message);
        return NextResponse.json(getDummyFlights());
    }
}