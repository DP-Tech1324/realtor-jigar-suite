import React, { useState, useRef, useEffect } from 'react';
import { Send, Home } from 'lucide-react';
import { chatWithAgent } from './aiClient';

/**
 * A reusable chat bubble component that surfaces an AI assistant.
 *
 * This base component encapsulates all UI and state logic for the chat
 * experience. It accepts a `context` prop to determine which prompt
 * template to use when sending user input to the underlying AI backend.
 *
 * The component maintains an internal list of messages, handles focus
 * management, shows a loading state while waiting for a response and
 * provides a toggle button to open/close the chat bubble. It relies
 * on the shared `chatWithAgent` helper to abstract away API calls.
 */
export type AiChatBubbleProps = {
  /**
   * Distinguishes between client and admin usage. The context is passed
   * through to chatWithAgent so that the appropriate prompt template
   * can be applied under the hood.
   */
  context: 'client' | 'admin';
  /**
   * Optional CSS className that will be applied to the outer wrapper.
   */
  className?: string;
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// Utility: strip any hidden <think> tags from AI replies. Some providers
// return these tags as metadata which we don't want to display to end users.
function cleanAIReply(content: string) {
  return content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

const welcomeMsg: Message = {
  role: 'assistant',
  content:
    "👋 Hi! I'm your AI assistant. Ask me anything about the platform or your work!",
};

const AiChatBubbleBase: React.FC<AiChatBubbleProps> = ({ context, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([welcomeMsg]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the latest message whenever the chat opens or messages update
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Automatically focus the input when the chat bubble opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => setIsOpen((open) => !open);

  const handleSend = async () => {
    if (loading) return;
    const trimmed = input.trim();
    if (!trimmed) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Please enter a message first!' },
      ]);
      return;
    }
    // Append user message locally
    const newMessages: Message[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const reply = await chatWithAgent(trimmed, context);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('AI error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'There was an error. Please try again later.' },
      ]);
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

  // Determine header text based on context. Customise here if desired.
  const headerTitle = context === 'admin' ? 'AI Admin Assistant' : 'AI Realtor Chat';
  const headerSubtitle = context === 'admin' ? 'AI Powered' : 'AI Powered';

  return (
    <div
      className={`fixed bottom-5 right-5 z-[1000] block visible ${className ?? ''}`.trim()}
    >
      {/* Toggle button */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open AI chat'}
        className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 text-realtor-navy rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center"
        style={{ boxShadow: '0 4px 24px rgba(50,50,100,.08)' }}
      >
        {isOpen ? <span className="text-2xl">✕</span> : <Home size={32} />}
      </button>
      {/* Chat bubble container */}
      <div
        className={`transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-6'
        } fixed bottom-24 right-6 w-80 max-w-xs sm:max-w-sm bg-white shadow-2xl rounded-2xl border border-gray-200`}
      >
        {isOpen && (
          <div className="flex flex-col h-[440px]">
            {/* Header */}
            <div className="flex items-center gap-2 bg-realtor-navy text-white rounded-t-2xl p-3 shadow">
              <Home className="bg-yellow-400 text-realtor-navy rounded-full p-1" size={32} />
              <div>
                <span className="font-semibold">{headerTitle}</span>
                <div className="text-xs opacity-75">{headerSubtitle}</div>
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
                  className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div
                    className={`rounded-xl px-3 py-2 max-w-[75%] shadow-sm text-sm whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-realtor-gold text-right text-realtor-navy'
                        : 'bg-white border border-yellow-300 text-gray-700'
                    }`}
                  >
                    {msg.role === 'assistant' ? cleanAIReply(msg.content) : msg.content}
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
            {/* Input area */}
            <form
              className="flex items-center gap-2 border-t border-gray-200 px-3 py-2 bg-white rounded-b-2xl"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                ref={inputRef}
                className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-base outline-none focus:ring-2 focus:ring-realtor-gold transition"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your question…"
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

export default AiChatBubbleBase;