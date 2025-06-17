import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export default async function handler(req, res) {
  try {
    // Parse body safely for local/Vercel
    let body = req.body;
    if (!body) {
      body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(new Error("Invalid JSON"));
          }
        });
        req.on('error', err => reject(err));
      });
    }

    const { messages } = body;
    // Realtor-focused system prompt
    const finalMessages = [
      {
        role: 'system',
        content: `You are a knowledgeable, friendly AI assistant for a real estate agency.
You ONLY answer real estate, property, mortgage, or realtor-related questions for home buyers and sellers.
Do NOT answer off-topic or unrelated queries. Provide clear, concise, accurate info on listings, property search, market trends, real estate terms, and the buying/selling process.
If you don't know, politely say you specialize in real estate topics only.`
      },
      ...messages
    ];

    const result = await generateText({
      model: groq('qwen-qwq-32b'),   // <-- Here!
      messages: finalMessages,
    });

    res.status(200).json({
      choices: [{ message: { content: result.text } }]
    });

  } catch (err) {
    console.error("Groq Chat Error:", err);
    res.status(500).json({ error: err.message || 'AI Chat failed' });
  }
}
