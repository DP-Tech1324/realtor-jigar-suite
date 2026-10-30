import { callAI } from '@/lib/ai';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

/**
 * Sends the conversation to the admin AI endpoint (api/ai.js, Claude) and
 * returns the assistant's reply. Requires a signed-in staff session.
 */
export async function chatWithAgent(messages: ChatMessage[]): Promise<string> {
  const { reply } = await callAI<{ reply: string }>('chat', { messages });
  return reply;
}
