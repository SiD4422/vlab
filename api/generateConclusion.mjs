export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { experimentTitle, readings } = req.body;

  if (!experimentTitle || !readings) {
    return res.status(400).json({ error: 'Missing experimentTitle or readings in request body' });
  }

  // Use OpenRouter to reuse the existing configured API key
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenRouter API key is not configured on the server' });
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
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter Error:', errText);
      return res.status(response.status).json({ error: 'AI generation failed.' });
    }

    const data = await response.json();
    const conclusion = data.choices?.[0]?.message?.content;
    
    if (!conclusion) {
      return res.status(500).json({ error: 'AI returned an empty response.' });
    }

    return res.status(200).json({ conclusion });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
}
