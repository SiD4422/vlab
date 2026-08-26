export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { experimentTitle, readings } = req.body;

  if (!experimentTitle || !readings) {
    return res.status(400).json({ error: 'Missing experimentTitle or readings in request body' });
  }

  // The API key is injected securely by Vercel (or our local Vite mock) from environment variables
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server' });
  }

  const prompt = `You are a strict Engineering Professor grading a lab record.
Experiment Name: ${experimentTitle}
Student's Recorded Data (JSON format): ${readings}

Task: Write a highly specific, scientific "Conclusion" section for the student's lab report.
1. Explicitly state whether the data confirms the theoretical principles of the ${experimentTitle}.
2. Reference specific numbers from the student's data (e.g., "As seen in Trial 1, when X was Y...") to prove your point.
3. Explain the physical phenomenon observed.
Do NOT use conversational filler like "Here is the conclusion". Return ONLY the raw, professional text of the conclusion in 1-2 paragraphs.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 2000 }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to communicate with Gemini API');
    }

    return res.status(200).json({
      conclusion: data.candidates[0].content.parts[0].text
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
}
