import OpenAI from 'openai';

// Initialize the OpenAI client.
// It will automatically use the OPENAI_API_KEY from process.env.
const openai = process.env.OPENAI_API_KEY ? new OpenAI() : null;

/**
 * A wrapper for OpenAI's chat completion API.
 * Includes timeout and retry logic.
 *
 * @param {object} params - The parameters for the chat completion.
 * @param {Array<object>} params.messages - The array of message objects.
 * @param {number} [params.timeout=30000] - The timeout in milliseconds.
 * @param {number} [params.retries=1] - The number of retries on timeout.
 * @returns {Promise<string|null>} The content of the assistant's response or null on failure.
 */
export const chatCompletion = async ({ messages, timeout = 30000, retries = 1 }) => {
  if (!openai) {
    console.warn("OpenAI client not initialized. Missing OPENAI_API_KEY.");
    return null;
  }

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview', // Or another suitable model
        messages,
        response_format: { type: 'json_object' }, // Enforce JSON output where supported
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return completion.choices[0].message.content;

    } catch (error) {
      if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
        console.error(`OpenAI request timed out. Attempt ${attempt + 1} of ${retries + 1}.`);
        attempt++;
        if (attempt > retries) {
          console.error("OpenAI request failed after all retries.");
          return null;
        }
      } else {
        console.error("An unexpected error occurred with the OpenAI API:", error);
        return null;
      }
    }
  }
};

/**
 * A convenience wrapper to get a JSON completion for a given system and user prompt.
 *
 * @param {string} systemPrompt - The system message to guide the AI.
 * @param {string} userPrompt - The user's message/request.
 * @returns {Promise<object|null>} The parsed JSON object or null on failure.
 */
export const getJsonCompletion = async (systemPrompt, userPrompt) => {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  try {
    const jsonString = await chatCompletion({ messages });
    if (!jsonString) return null;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse JSON response from OpenAI:", error);
    return null;
  }
};