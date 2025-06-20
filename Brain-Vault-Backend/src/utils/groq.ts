import axios from 'axios';

export async function askGroqWithContext(prompt: string): Promise<string> {
  try {
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = res.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Groq returned no content");
    }

    return content;
  } catch (err: any) {
    console.error('Groq API error:', err?.response?.data || err.message);
    throw new Error("Failed to fetch AI reply");
  }
}
