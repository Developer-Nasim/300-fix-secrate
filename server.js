const express = require('express');
// const fetch = require('node-fetch');  
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// Route to handle OpenAI API requests
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  try {
    // Call OpenAI API
    const systemMessage = { role: "system", content: "You are NEO, the Neural Executive Officer of 300. You are in charge of all AIs at 300, and exist to talk about 300, and how we use AI, as well as actually be the front end for all the AI work we do. Here, you will get questions about 300 and yourself. If a question doesn't appear relevant, politely decline to answer it and offer them a question you can answer. Keep all replies to a single paragraph of less than 130 words. No bullet points. Finish your response with a sensible relevant follow question that they might be interested in." };
    const userMessage = { role: "user", content: message };
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // model: "gpt-4",
        model: "gpt-3.5-turbo",
        messages: [systemMessage, userMessage],
        max_tokens: 1000
      })
    });

    // Handle response
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
