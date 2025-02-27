export default async function handler(req, res) {
    const apiKey = process.env.OPENAI_API_KEY;
    const { prompt } = req.body;

    if (!apiKey) {
        return res.status(500).json({ error: 'Missing OpenAI API key' });
    }

    if (!prompt) {
        return res.status(400).json({ error: 'No prompt provided' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }]
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return res.status(response.status).json({ error: errorDetails });
        }

        const data = await response.json();
        const answer = data.choices[0]?.message?.content || 'No answer received from the model.';
        res.status(200).json({ answer });

    } catch (error) {
        console.error('Request failed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
