export async function askAI({ model = "gpt-4o", provider = "openai", prompt }) {
  const endpoint = provider === "openai"
    ? "https://api.openai.com/v1/chat/completions"
    : "https://api.groq.com/openai/v1/chat/completions";
  const apiKey = provider === "openai"
    ? import.meta.env.VITE_OPENAI_API_KEY
    : import.meta.env.VITE_GROQ_API_KEY;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response";
}