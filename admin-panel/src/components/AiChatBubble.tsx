import React, { useState, useRef, useEffect } from 'react';
import { Send, Home } from 'lucide-react';

// Utility function to remove <think>...</think> from AI output
function cleanAIReply(content: string) {
  return content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}


type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const welcomeMsg: Message = {
  role: 'assistant',
  content: "👋 Hi! I'm your AI Realtor Assistant. Ask me anything about listings, buying, selling, or the real estate market!"
};

const AiChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([welcomeMsg]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Auto-focus input
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const toggleChat = () => setIsOpen((open) => !open);

  const handleSend = async () => {
    if (loading) return;
    if (!input.trim()) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Please enter a message first!' },
      ]);
      return;
    }
    const userMessage = input.trim();
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/groq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I didn’t understand that.';
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: reply }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'There was an error. Please try again later.' }
      ]);
      console.error('Groq error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && input.trim().length > 0) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[1000] block visible">
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open AI chat'}
        className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 text-realtor-navy rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center"
        style={{ boxShadow: '0 4px 24px rgba(50,50,100,.08)' }}
      >
        {isOpen ? <span className="text-2xl">✕</span> : <Home size={32} />}
      </button>

      {/* Chat Bubble */}
      <div className={`transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-6'} fixed bottom-24 right-6 w-80 max-w-xs sm:max-w-sm bg-white shadow-2xl rounded-2xl border border-gray-200`}>
        {isOpen && (
          <div className="flex flex-col h-[440px]">
            {/* Header */}
            <div className="flex items-center gap-2 bg-realtor-navy text-white rounded-t-2xl p-3 shadow">
              <Home className="bg-yellow-400 text-realtor-navy rounded-full p-1" size={32} />
              <div>
                <span className="font-semibold">AI Realtor Chat</span>
                <div className="text-xs opacity-75">AI Powered </div>
              </div>
              <button
                onClick={toggleChat}
                className="ml-auto p-2 hover:bg-realtor-gold/10 rounded-lg transition-colors"
                aria-label="Close"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-gray-50">
              {messages.map((msg, i) => (
  <div
    key={i}
    className={
      msg.role === 'user'
        ? "flex justify-end"
        : "flex justify-start"
    }
  >
    <div className={`rounded-xl px-3 py-2 max-w-[75%] shadow-sm text-sm whitespace-pre-wrap ${msg.role === 'user'
      ? 'bg-realtor-gold text-right text-realtor-navy'
      : 'bg-white border border-yellow-300 text-gray-700'
    }`}>
      {msg.role === 'assistant'
        ? cleanAIReply(msg.content)
        : msg.content}
    </div>
  </div>
))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-xl px-3 py-2 bg-white border border-yellow-300 shadow-sm text-sm text-gray-400 animate-pulse">
                    <span>🤖 AI is typing</span>
                    <span className="ml-2 animate-bounce">...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <form
              className="flex items-center gap-2 border-t border-gray-200 px-3 py-2 bg-white rounded-b-2xl"
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                ref={inputRef}
                className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-base outline-none focus:ring-2 focus:ring-realtor-gold transition"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask a real estate question…"
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-label="Type your message"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={loading || input.trim().length === 0}
                className="bg-gradient-to-br from-realtor-gold to-yellow-400 text-realtor-navy rounded-lg p-2 shadow-md hover:scale-110 transition-transform disabled:opacity-50"
                aria-label="Send"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiChatBubble;
// Note: Ensure you have the necessary styles and dependencies installed for this component to work correctly.