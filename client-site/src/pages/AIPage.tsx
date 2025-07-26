import ProtectedRoute from './ProtectedRoute';
import { askAI } from '../../../shared/ai/aiClient';
import React, { useState } from 'react';
// Import the shared chat bubble. This wraps our base component and
// sets the context to "client" so the AI knows it is assisting end users.
import AiChatBubble from '@/components/AiChatBubble';

export default function AIPage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  async function handleAsk() {
    const res = await askAI({ prompt: input, model: 'gpt-4o', provider: 'openai' });
    setResponse(res);
  }
  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <div style={{ padding: 40, fontSize: 24 }}>
        🤖 AI Agent Page
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: 300, height: 60 }}
          />
          <button onClick={handleAsk}>Ask AI</button>
        </div>
        <div style={{ background: '#eee', marginTop: 12, padding: 8 }}>{response}</div>
        {/* Mount the AI chat bubble in the bottom right. Passing no props defaults to the client context. */}
        <AiChatBubble />
      </div>
    </ProtectedRoute>
  );
}
