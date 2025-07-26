import React from 'react';
import AiChatBubbleBase from '@/shared/ai/AiChatBubbleBase';

/**
 * Wrapper component for the admin panel.
 *
 * This component simply renders the shared AiChatBubbleBase with the
 * context set to "admin". Any future admin‑specific overrides can be
 * added here without touching the base component.
 */
const AiChatBubble: React.FC = () => {
  return <AiChatBubbleBase context="admin" />;
};

export default AiChatBubble;