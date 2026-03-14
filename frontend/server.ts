import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Roadmap Generation Endpoint
  app.post("/api/generate-roadmap", async (req, res) => {
    const { careerGoal, learningStyle, skillLevel } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Generate a personalized learning roadmap for a ${skillLevel} level student wanting to become a ${careerGoal}. 
      The learning style is ${learningStyle}. 
      Return the response as a JSON array of 5 modules. Each module should have:
      - id (string)
      - title (string)
      - description (string)
      - videoUrl (string, use a placeholder youtube link)
      - status (string, set first to 'in-progress', others to 'locked')
      - progress (number, 0)`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });

      const roadmap = JSON.parse(response.text);
      res.json(roadmap);
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: "Failed to generate roadmap" });
    }
  });

  // Mock endpoints for Labs and Mentors (could be moved to Firestore later)
  app.get("/api/labs", (req, res) => {
    res.json([
      { id: "1", name: "Physics Projectile Simulator", category: "Physics", description: "Simulate projectile motion with varying gravity and angles.", thumbnail: "https://picsum.photos/seed/physics/400/300" },
      { id: "2", name: "Chemistry Titration Lab", category: "Chemistry", description: "Perform virtual acid-base titrations with precision.", thumbnail: "https://picsum.photos/seed/chemistry/400/300" },
      { id: "3", name: "AI Model Training Demo", category: "Computer Science", description: "Visualize neural network training in real-time.", thumbnail: "https://picsum.photos/seed/ai/400/300" }
    ]);
  });

  app.get("/api/mentors", (req, res) => {
    res.json([
      { id: "1", name: "Dr. Sarah Chen", expertise: "Quantum Computing", availability: "Mon, Wed 4-6 PM", avatar: "https://i.pravatar.cc/150?u=sarah" },
      { id: "2", name: "James Wilson", expertise: "Full Stack Development", availability: "Tue, Thu 10-12 AM", avatar: "https://i.pravatar.cc/150?u=james" },
      { id: "3", name: "Elena Rodriguez", expertise: "Data Science", availability: "Fri 2-5 PM", avatar: "https://i.pravatar.cc/150?u=elena" }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
