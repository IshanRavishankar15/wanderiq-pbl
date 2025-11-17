
import { NextResponse } from 'next/server';
import { getJsonCompletion } from '@/lib/openaiClient';
import {
  travelExpertSystemPrompt,
  getRecommendedDestinationsPrompt,
  getTrendingDestinationsPrompt
} from '@/lib/serverPrompts';

async function getImageForPlace(place, req) {
  try {
    const origin = req.headers.get('origin');
    const unsplashResponse = await fetch(`${origin}/api/unsplash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `${place.name} travel destination` }),
    });

    if (!unsplashResponse.ok) {
        throw new Error(`Unsplash API call failed with status: ${unsplashResponse.status}`);
    }

    const imageData = await unsplashResponse.json();
    return {
        ...place,
        imageUrl: imageData.imageUrl || '/placeholder.jpg', 
        alt: imageData.altDescription || `Image of ${place.name}`,
    };
  } catch (error) {
    console.error(`Failed to get image for ${place.name}:`, error);
    return { ...place, imageUrl: '/placeholder.jpg', alt: `Placeholder image for ${place.name}` };
  }
}

export async function POST(req) {
  try {
    const { savedDestinations } = await req.json();

    const recommendedPrompt = getRecommendedDestinationsPrompt(savedDestinations);
    const trendingPrompt = getTrendingDestinationsPrompt();

    const [recommendedResponse, trendingResponse] = await Promise.all([
      getJsonCompletion(travelExpertSystemPrompt, recommendedPrompt),
      getJsonCompletion(travelExpertSystemPrompt, trendingPrompt)
    ]);

    const recommendedPlaces = recommendedResponse?.destinations || [];
    const trendingPlaces = trendingResponse?.destinations || [];

    const [recommendedWithImages, trendingWithImages] = await Promise.all([
      Promise.all(recommendedPlaces.map(place => getImageForPlace(place, req))),
      Promise.all(trendingPlaces.map(place => getImageForPlace(place, req)))
    ]);

    return NextResponse.json({
      recommended: recommendedWithImages,
      trending: trendingWithImages,
    });

  } catch (error) {
    console.error('Error in recommendations route:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch recommendations.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}