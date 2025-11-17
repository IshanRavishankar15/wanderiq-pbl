import { NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/openaiClient';
import { CHAT_SYSTEM_PROMPT, createChatUserPrompt } from '@/lib/serverPrompts';

export async function POST(request) {
  try {
    const { messages, itinerary } = await request.json();

    if (!messages || !itinerary) {
      return NextResponse.json({ error: 'Missing messages or itinerary context' }, { status: 400 });
    }
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        content: 'AI is currently unavailable. Please try again later.',
      });
    }
    
    const fullUserPrompt = createChatUserPrompt(itinerary, messages);
    const systemMessage = { role: 'system', content: CHAT_SYSTEM_PROMPT };
    const userMessage = { role: 'user', content: fullUserPrompt };

    const aiTextResponse = await chatCompletion({ messages: [systemMessage, userMessage] });
    
    if (!aiTextResponse) {
        return NextResponse.json({ content: 'Sorry, I had trouble processing that. Could you try again?' });
    }
    
    return NextResponse.json({ content: aiTextResponse });

  } catch (error) {
    console.error(`Error in /api/chat: ${error.message}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}