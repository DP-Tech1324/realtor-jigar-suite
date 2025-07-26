/**
 * Prompt templates for various AI operations in the Realtor Jigar Suite.
 *
 * Existing prompts are consolidated in the `PROMPTS` object. Additional
 * helper functions `getClientPrompt` and `getAdminPrompt` generate
 * context-specific prompts for the chat bubble. These functions wrap the
 * user input with guidance so the AI knows whether it is assisting an
 * end client or an admin user.
 */
export const PROMPTS = {
  generateListingDescription: (property: any) =>
    `Write a beautiful listing description for:\n${JSON.stringify(property)}`,
  summarizeInquiries: (inquiries: any[]) =>
    `Summarize these inquiries and suggest next steps:\n${JSON.stringify(
      inquiries,
    )}`,
  devHelper: (task: string) =>
    `You are an AI developer assistant. Task: "${task}". Suggest files or code.`,
  detectSecurityRisks: (logs: string) =>
    `Analyze these logs and identify any security threats: ${logs}`,
  roadmapSuggestion: `Suggest improvements for our real estate platform.`,
};

/**
 * Generate a prompt tailored for end users browsing the client site.
 *
 * This helper encourages the language model to answer questions as a
 * helpful assistant for real estate clients. It accepts the raw user
 * input and returns a string prompt that can be passed directly to
 * chatWithAgent.
 *
 * @param input The user‑provided message
 */
export const getClientPrompt = (input: string) =>
  `You are a helpful assistant for real estate clients. Answer this: ${input}`;

/**
 * Generate a prompt tailored for administrative users in the admin panel.
 *
 * This helper instructs the model to behave as an assistant for agents
 * managing properties and inquiries. It accepts the raw user input and
 * returns a string prompt that can be passed directly to chatWithAgent.
 *
 * @param input The user‑provided message
 */
export const getAdminPrompt = (input: string) =>
  `You are a real estate admin assistant. Help the agent with: ${input}`;