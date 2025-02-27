export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        console.log('Request Body:', req.body);  // Log request body for debugging
        const { prompt } = req.body;

        if (!prompt) {
            console.log('No prompt provided');  // Log if prompt is missing
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            })
        });

        const data = await response.json();
        console.log('OpenAI Response:', data);  // Log OpenAI's response

        if (!response.ok) {
            console.error('OpenAI API Error:', data);
            return res.status(500).json({ error: 'Failed to get response from OpenAI' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
