import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { PhotoStyle, MenuItem, GeneratedPhoto } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Step 1: Parse the menu text into a list of items
 */
async function parseMenu(menuText: string): Promise<MenuItem[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: [{ parts: [{ text: `Extract the menu items from this text into a JSON array of objects with 'name' and 'description'. Keep descriptions concise but appetizing. 
    Menu text:
    ${menuText}` }] }],
    config: {
      responseMimeType: 'application/json',
    }
  });

  try {
    const rawItems = JSON.parse(response.text || '[]');
    return rawItems.map((item: any, index: number) => ({
      id: `item-${index}`,
      name: item.name,
      description: item.description,
    }));
  } catch (e) {
    console.error('Failed to parse menu items:', e);
    return [];
  }
}

/**
 * Step 2: Generate a photo for a specific item
 */
async function generatePhoto(item: MenuItem, style: PhotoStyle): Promise<GeneratedPhoto> {
  const stylePrompts = {
    rustic: "High-end rustic food photography on a dark wood table with moody side lighting. Use ceramic plates, linen napkins, and natural crumbs for texture. Soft bokeh in background.",
    modern: "Ultra-modern, clean food photography. Bright, even lighting. Minimalist white marble background. Precise plating. Professional studio shot.",
    'top-down': "Social media style flat-lay food photography. Top-down view. Organized composition with utensils and ingredients around the plate. Bright and vibrant colors."
  };

  const prompt = `${stylePrompts[style]}. Subject: ${item.name}. ${item.description}. Professional food styling, realistic textures, steam where appropriate, photorealistic, 4k resolution.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      imageConfig: {
        aspectRatio: '1:1',
        imageSize: '1K',
      }
    }
  });

  let imageUrl = '';
  // Iterate through parts to find the image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  return {
    id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    menuItemName: item.name,
    url: imageUrl,
    style: style
  };
}

// API Routes
app.post('/api/generate-photos', async (req, res) => {
  try {
    const { menuText, style } = req.body;
    
    if (!menuText || !style) {
      return res.status(400).json({ error: 'Menu text and style are required.' });
    }

    // 1. Parse menu
    const items = await parseMenu(menuText);
    
    if (items.length === 0) {
      return res.status(400).json({ error: 'No menu items could be extracted.' });
    }

    // 2. Generate photos (limit to 6 for speed/demo purposes)
    const itemsToProcess = items.slice(0, 6);
    const photos = await Promise.all(itemsToProcess.map(item => generatePhoto(item, style)));

    res.json({ photos });
  } catch (error: any) {
    console.error('Generation Flow Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate food photography.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Virtual Food Photographer server running at http://localhost:${PORT}`);
  });
}

startServer();
