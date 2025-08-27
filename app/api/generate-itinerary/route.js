import { NextResponse } from 'next/server';
import { getJsonCompletion } from '@/lib/openaiClient';
import { validateItinerary } from '@/lib/schema';
import { GENERATE_ITINERARY_SYSTEM_PROMPT, createGenerateItineraryUserPrompt } from '@/lib/serverPrompts';
import { getDummyItinerary } from '@/lib/dummyData';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Basic server-side validation of inputs
    if (!body.destination || !body.startDate || !body.endDate || !body.budget) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn("AI unavailable: OPENAI_API_KEY not set. Using fallback.");
      const dummyItinerary = getDummyItinerary(body);
      return NextResponse.json(dummyItinerary);
    }
    
    const userPrompt = createGenerateItineraryUserPrompt(body);
    const aiResponse = await getJsonCompletion(GENERATE_ITINERARY_SYSTEM_PROMPT, userPrompt);
    
    if (!aiResponse) {
      console.error("AI response was null or empty. Using fallback.");
      return NextResponse.json(getDummyItinerary(body));
    }

    // Validate the AI's JSON output against our schema
    const isValid = validateItinerary(aiResponse);
    if (!isValid) {
      console.error("AI response failed schema validation:", validateItinerary.errors);
      // Fallback to dummy data if AI output is invalid
      return NextResponse.json(getDummyItinerary(body));
    }
    
    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error(`Error in /api/generate-itinerary: ${error.message}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}