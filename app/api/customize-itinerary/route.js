

import { NextResponse } from 'next/server';
import { getJsonCompletion } from '@/lib/openaiClient';
import { validateItinerary } from '@/lib/schema';
import { CUSTOMIZE_ITINERARY_SYSTEM_PROMPT, createCustomizeItineraryUserPrompt } from '@/lib/serverPrompts';

export async function POST(request) {
  try {
    const { itinerary, userRequest } = await request.json();

    if (!itinerary || !userRequest) {
      return NextResponse.json({ error: 'Missing itinerary or user request' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'AI service is unavailable' }, { status: 503 });
    }

    const userPrompt = createCustomizeItineraryUserPrompt(itinerary, userRequest);
    const aiResponse = await getJsonCompletion(CUSTOMIZE_ITINERARY_SYSTEM_PROMPT, userPrompt);

    if (!aiResponse || !aiResponse.updatedItinerary || !aiResponse.textresponse) {
      return NextResponse.json({ error: "AI returned an incomplete response." }, { status: 500 });
    }

    const isValid = validateItinerary(aiResponse.updatedItinerary);
    if (!isValid) {
      console.error("AI's updatedItinerary failed schema validation:", validateItinerary.errors);
   
      return NextResponse.json({ textresponse: "I tried to make that change, but there was an issue with the plan's structure. Could you try describing the change differently?" });
    }

    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error(`Error in /api/customize-itinerary: ${error.message}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}