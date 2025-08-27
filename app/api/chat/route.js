// --- api/chat/route.js ---
import { NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/openaiClient';
import { validateItinerary } from '@/lib/schema';
import { CHAT_SYSTEM_PROMPT, createChatUserPrompt } from '@/lib/serverPrompts';

export async function POST(request) {
  try {
    const { messages, itinerary } = await request.json();

    if (!messages || !itinerary) {
      return NextResponse.json({ error: 'Missing messages or itinerary context' }, { status: 400 });
    }
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        role: 'assistant',
        content: 'AI is currently unavailable. Please try again later.',
      });
    }
    
    const fullUserPrompt = createChatUserPrompt(itinerary, messages);
    const systemMessage = { role: 'system', content: CHAT_SYSTEM_PROMPT };
    const userMessage = { role: 'user', content: fullUserPrompt };

    const aiResponseString = await chatCompletion({ messages: [systemMessage, userMessage] });
    
    if (!aiResponseString) {
        return NextResponse.json({ role: 'assistant', content: 'Sorry, I had trouble processing that. Could you try again?' });
    }
    
    const aiResponse = JSON.parse(aiResponseString);

    if (aiResponse.updatedItinerary) {
        const isValid = validateItinerary(aiResponse.updatedItinerary);
        if (!isValid) {
            console.error("AI's updatedItinerary failed schema validation:", validateItinerary.errors);
            delete aiResponse.updatedItinerary;
            aiResponse.content = (aiResponse.content || "") + "\n\n(I tried to update the itinerary but there was an issue. Please try describing the change again.)";
        }
    }
    
    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error(`Error in /api/chat: ${error.message}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}