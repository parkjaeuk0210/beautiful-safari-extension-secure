// Vercel serverless function for secure Gemini API calls
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { message, history, files } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        // Initialize Gemini with environment variable
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            generationConfig: {
                temperature: 0.7,
                topK: 32,
                topP: 0.8,
                maxOutputTokens: 8192,
            }
        });
        
        let parts = [message];
        
        // Add files if provided
        if (files && files.length > 0) {
            parts = parts.concat(files);
        }
        
        let result;
        
        if (history && history.length > 0) {
            // Continue conversation with history
            const chat = model.startChat({
                history: history.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.text }]
                }))
            });
            result = await chat.sendMessage(parts);
        } else {
            // Start new conversation
            result = await model.generateContent(parts);
        }
        
        const response = await result.response;
        const text = response.text();
        
        res.status(200).json({ 
            text: text,
            success: true 
        });
        
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ 
            error: 'Failed to process request',
            details: error.message 
        });
    }
}