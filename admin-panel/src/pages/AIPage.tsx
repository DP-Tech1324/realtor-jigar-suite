import ProtectedRoute from './ProtectedRoute';
import { askAI } from '../../../shared/ai/aiClient';
import React, { useState } from 'react';

export default function AIPage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  async function handleAsk() {
    const res = await askAI({ prompt: input, model: 'gpt-4o', provider: 'openai' });
    setResponse(res);
  }
  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <div style={{padding:40, fontSize:24}}>
        🤖 AI Agent Page
        <div>
          <textarea value={input} onChange={e => setInput(e.target.value)} style={{ width: 300, height: 60 }} />
          <button onClick={handleAsk}>Ask AI</button>
        </div>
        <div style={{ background: "#eee", marginTop: 12, padding: 8 }}>{response}</div>
      </div>
    </ProtectedRoute>
  );
}
