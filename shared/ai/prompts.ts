export const PROMPTS = {
  generateListingDescription: (property) =>
    `Write a beautiful listing description for: ${JSON.stringify(property)}`,
  summarizeInquiries: (inquiries) =>
    `Summarize these inquiries and suggest next steps: ${JSON.stringify(inquiries)}`,
  devHelper: (task) =>
    `You are an AI developer assistant. Task: "${task}". Suggest files or code.`,
  detectSecurityRisks: (logs) =>
    `Analyze these logs and identify any security threats: ${logs}`,
  roadmapSuggestion: `Suggest improvements for our real estate platform.`,
};