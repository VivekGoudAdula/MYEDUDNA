import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3001;

  app.use(express.json());

  // AI Roadmap Generation Endpoint
  app.post("/api/generate-roadmap", async (req, res) => {
    const { careerGoal, learningStyle, skillLevel } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Groq API key not configured" });
    }

    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      
      const prompt = `Generate a personalized learning roadmap for a ${skillLevel} level student wanting to become a ${careerGoal}. 
      The learning style is ${learningStyle}. 
      Return the response as a JSON array of 5 modules. Each module should have:
      - id (string)
      - title (string)
      - description (string)
      - videoUrl (string, use a placeholder youtube link)
      - status (string, set first to 'in-progress', others to 'locked')
      - progress (number, 0)`;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const textOutput = response.choices[0]?.message?.content || "[]";
      // Ensure the returned structure from JSON object wraps arrays correctly or parse it if our prompt just requested array
      let roadmap;
      try {
        const parsed = JSON.parse(textOutput);
        roadmap = Array.isArray(parsed) ? parsed : (parsed.modules || parsed);
      } catch (e) {
        roadmap = [];
      }
      
      res.json(roadmap);
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: "Failed to generate roadmap" });
    }
  });

  // Mock endpoints for Labs and Mentors (empty for now until real data is added)
  app.get("/api/labs", (req, res) => {
    res.json([]);
  });

  app.get("/api/mentors", (req, res) => {
    res.json([]);
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
