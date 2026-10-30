export type ChatMessage = { role: 'user' | 'assistant'; content: string };

/**
 * Sends the conversation to the public site's chat endpoint (api/chat.js,
 * Claude) and returns the assistant's reply. The API key stays on the server.
 */
export async function chatWithAgent(messages: ChatMessage[]): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Chat failed (${res.status})`);
  return body.reply;
}
