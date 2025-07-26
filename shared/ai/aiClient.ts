import { getClientPrompt, getAdminPrompt } from './prompts';

/**
 * Low level helper to call a chat completion API (OpenAI or Groq).
 *
 * When working with multiple providers it can be useful to keep the
 * underlying fetch logic encapsulated. This function accepts a model,
 * provider and prompt and returns the assistant's reply as a string.
 *
 * @param opts.model The model to use (defaults to gpt‑4o)
 * @param opts.provider The provider to use (openai or groq)
 * @param opts.prompt The full prompt to send to the model
 */
export async function askAI({
  model = 'gpt-4o',
  provider = 'openai',
  prompt,
}: {
  model?: string;
  provider?: 'openai' | 'groq';
  prompt: string;
}): Promise<string> {
  const endpoint =
    provider === 'openai'
      ? 'https://api.openai.com/v1/chat/completions'
      : 'https://api.groq.com/openai/v1/chat/completions';
  const apiKey =
    provider === 'openai'
      ? import.meta.env.VITE_OPENAI_API_KEY
      : import.meta.env.VITE_GROQ_API_KEY;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response';
}

/**
 * Higher level helper used by the chat bubble to interface with the AI.
 *
 * This function determines the correct prompt template based on the given
 * context (`client` or `admin`), then invokes `askAI` and returns the
 * assistant's response. Expose this instead of askAI to encapsulate
 * prompt construction.
 *
 * @param input The raw message entered by the user
 * @param context Either "client" or "admin", used to pick the prompt template
 */
export async function chatWithAgent(
  input: string,
  context: 'client' | 'admin',
): Promise<string> {
  const prompt = context === 'admin' ? getAdminPrompt(input) : getClientPrompt(input);
  return await askAI({ prompt });
}