export const GENERATE_ITINERARY_SYSTEM_PROMPT = `Output a valid JSON object matching the schema below.
**JSON Schema:**
- destination: string
- startDate: string (YYYY-MM-DD)
- endDate: string (YYYY-MM-DD)
- travelers: integer
- interests: string
- summary: string
- image: string (MUST be a valid https:// URI)
- days: array of Day objects
  - id: integer
  - date: string (YYYY-MM-DD)
  - activities: array of Activity objects
    - id: integer
    - time: string
    - activity: string
    - location: string
    - type: string (One of: 'sightseeing', 'culture', 'food', 'relax', 'adventure', 'transport', 'other')
    - weather: string (Format strictly: "Emoji Phrase Temp", e.g. "🌤️ Clear • 15°C")
    - travelToNext: object (nullable for last activity)
      - distance: string (e.g. "3 km")
      - time: string (e.g. "15 min")

**Follow these rules strictly:**
1. **Daily Structure:** Each day MUST have Breakfast, Lunch, Dinner (at real, popular restaurants) + 3 distinct activities.
2. **Logic:** Cluster activities geographically to minimize travel. No repeated attractions.
3. **Data Types:** 'travelers', 'days.id', and 'activities.id' MUST be integers.
4. **Format:** Output purely valid JSON. No text or markdown.`;

export const createGenerateItineraryUserPrompt = (inputs) => {
    return `Generate itinerary: Destination=${inputs.destination}, Dates=${inputs.startDate} to ${inputs.endDate}, Travelers=${inputs.travelers}, Interests=${inputs.interests}.`;
};

export const CHAT_SYSTEM_PROMPT = `Answer the user's question based on the provided itinerary context. Keep answers conversational and concise. Do not output JSON.`;

export const createChatUserPrompt = (itinerary, messageHistory) => {
    const compactItinerary = JSON.stringify(itinerary).slice(0, 15000); 
    const conversation = messageHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    return `Context: ${compactItinerary}\n\nHistory:\n${conversation}`;
};

export const CUSTOMIZE_ITINERARY_SYSTEM_PROMPT = `Return a single JSON object with this structure:
{
  "updatedItinerary": { ... complete itinerary ... },
  "textresponse": "Confirmation message"
}
Apply the user's change to the itinerary.
**CRITICAL**: The "updatedItinerary" MUST retain all original fields, including 'image', 'interests', 'summary', and 'days'.`;

export const createCustomizeItineraryUserPrompt = (itinerary, userRequest) => {
    return `Itinerary: ${JSON.stringify(itinerary)}\nChange Request: "${userRequest}"`;
};

export const travelExpertSystemPrompt = "Respond with a minified JSON object.";

export const getRecommendedDestinationsPrompt = (savedDestinations) => {
  return `Based on [${savedDestinations.join(', ')}], recommend 10 new destinations. JSON Output: { "destinations": [ { "name": "City, Country", "description": "15 words max" } ] }`;
};

export const getTrendingDestinationsPrompt = () => {
  const currentYear = new Date().getFullYear();
  return `List 10 trending destinations for ${currentYear}. JSON Output: { "destinations": [ { "name": "City, Country", "description": "15 words max" } ] }`;
};