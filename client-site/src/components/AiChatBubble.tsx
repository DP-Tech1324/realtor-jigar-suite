import React from 'react';
import AiChatBubbleBase from '@/shared/ai/AiChatBubbleBase';

/**
 * Wrapper component for the client site.
 *
 * This component simply renders the shared AiChatBubbleBase with the
 * context set to "client". Any future client‑specific overrides can be
 * added here without touching the base component.
 */
const AiChatBubble: React.FC = () => {
  return <AiChatBubbleBase context="client" />;
};

export default AiChatBubble;