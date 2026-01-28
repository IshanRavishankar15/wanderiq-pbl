import OpenAI from 'openai';
import { APIError } from 'openai/error';
import https from 'https';

const agent = new https.Agent({
  keepAlive: true,
  timeout: 600000,
});

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  httpAgent: agent,
  timeout: 600000,
}) : null;

export const chatCompletion = async ({ messages, timeout = 300000, retries = 1, response_format = null }) => {
  if (!openai) {
    console.warn("OpenAI client not initialized. Missing OPENAI_API_KEY.");
    return null;
  }
  try {
    const body = {
      model: 'gpt-5-nano',
      messages,
      reasoning_effort: 'low',
    };
    if (response_format) {
        body.response_format = response_format;
    }
    const options = {
      timeout: timeout,
      maxRetries: retries,
    };
    const completion = await openai.chat.completions.create(body, options);
    return completion.choices[0].message.content;
  } catch (error) {
    if (error instanceof APIError) {
      console.error(`An OpenAI API error occurred: ${error.status} ${error.name}`, error);
    } else {
      console.error("An unexpected non-API error occurred:", error);
    }
    return null;
  }
};

export const getJsonCompletion = async (systemPrompt, userPrompt) => {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
  const jsonString = await chatCompletion({
    messages,
    response_format: { type: 'json_object' },
    timeout: 360000
  });
  if (!jsonString) {
    console.error("Received a null or empty response from chatCompletion.");
    return null;
  }
  try {
    const startIndex = jsonString.indexOf('{');
    const endIndex = jsonString.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1) {
        throw new Error("No valid JSON object found in the AI response.");
    }
    
    const extractedJson = jsonString.substring(startIndex, endIndex + 1);
    return JSON.parse(extractedJson);
  } catch (error) {
    console.error("Failed to parse JSON response from OpenAI:", error);
    console.error("Original string was:", jsonString);
    return null;
  }
};