export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, currentExperiment } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const systemPrompt = `You are "Professor V-Lab", an expert Electrical & Electronics Engineering tutor.
The student is currently in a virtual lab environment studying: ${currentExperiment || 'General Electrical & Electronics Engineering'}.

Your Persona Guidelines:
1. EXTREMELY HELPFUL: Answer any question the student asks related to electrical engineering, circuits, physics, math, or their lab experiment. Break down complex topics so they are easy to understand.
2. NO GATEKEEPING: Whether the question is as simple as "what is voltage?" or as complex as "RLC resonance analysis," you must answer it fully and politely. Do not force the student to answer questions first.
3. STRICT TOPIC BOUNDARIES (CRITICAL): You are an engineering tutor, nothing else. If the student asks about anything non-electrical or non-academic (e.g., sports, movies, "how are you", "Rohit Sharma vs Virat Kohli", politics), you must politely but firmly refuse to answer and steer the conversation back to engineering.
4. CONCISE & CLEAR: Keep your responses easy to read, well-formatted, and concise.

Start by warmly welcoming the student and asking how you can help them with their electrical engineering concepts today.`;

  // Prepend the system prompt to the messages
  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openrouter/free",
        "messages": apiMessages
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API Error:", errorData);
      return res.status(response.status).json({ error: 'Failed to communicate with AI Provider' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
