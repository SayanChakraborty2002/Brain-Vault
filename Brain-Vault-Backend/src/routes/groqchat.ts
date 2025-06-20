import express from 'express';
import { askGroqWithContext } from '../utils/groq'; // You already have this function

const router = express.Router();

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    res.status(400).json({ message: 'Prompt is required' });
    return 
  }

  try {
    const answer = await askGroqWithContext(prompt);
     res.status(200).json({ answer });return 
  } catch (err) {
    console.error('Groqchat error:', err);
    res.status(500).json({ message: 'AI failed to respond' });
    return 
  }
});

export default router;
