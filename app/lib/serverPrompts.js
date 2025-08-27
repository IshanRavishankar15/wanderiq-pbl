/**
 * Contains the exact system and user prompt examples used for server-side AI calls.
 */

// For /api/generate-itinerary/route.js
export const GENERATE_ITINERARY_SYSTEM_PROMPT = `You are an assistant that must output **only valid JSON** and nothing else. The JSON must exactly follow the Itinerary JSON Schema described below. Do not include any explanation, backticks, or additional text. Strictly return a single JSON object that includes: destination, startDate, endDate, travelers, budget (the user's input), interests, summary (1-2 sentences), image (a real, public URL to an image of the destination), days (array of day objects with id, date, activities[] where each activity has id, time, activity, location, type), and budgetDetails (an array of {id, category, amount}). Types must match (integers for ids and travelers, ISO date strings for dates). Activity types must be one of: 'sightseeing', 'culture', 'food', 'relax', 'adventure', 'transport', 'other'. Respond with syntactically valid JSON only.`;

export const createGenerateItineraryUserPrompt = (inputs) => {
    return `User input: destination='${inputs.destination}', startDate='${inputs.startDate}', endDate='${inputs.endDate}', travelers=${inputs.travelers}, budget='${inputs.budget}', interests='${inputs.interests}'. Please produce a valid itinerary JSON that fits the schema.`;
};


// For /api/chat/route.js
export const CHAT_SYSTEM_PROMPT = `You are an assistant that knows about the user's itinerary. The server will provide the current itinerary JSON in the user message. Use that context to answer user requests. If the user asks to modify the itinerary, you may respond with a normal message and additionally provide a strict JSON object under the field "updatedItinerary" that follows the Itinerary JSON Schema exactly. All "updatedItinerary" JSON objects must be valid and the server will validate them. If not modifying the itinerary, reply conversationally. Do not include extraneous commentary or backticks.`;

export const createChatUserPrompt = (itinerary, messageHistory) => {
    const compactItinerary = JSON.stringify({
        destination: itinerary.destination,
        startDate: itinerary.startDate,
        endDate: itinerary.endDate,
        days: itinerary.days.map(d => ({ date: d.date, activities: d.activities.map(a => a.activity) }))
    });

    const conversation = messageHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');

    return `Current Itinerary Context: ${compactItinerary}\n\nConversation History:\n${conversation}`;
};