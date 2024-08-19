import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

import { callGeminiPrompt } from "./endpoints/gemini-json-questions-answers-from-prompt.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(
  "/scripts",
  express.static(path.join(__dirname, "..", "client", "scripts"))
);

app.use(
  "/styles",
  express.static(path.join(__dirname, "..", "client", "styles"))
);

app.get("/", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "client",
      "pages",
      "google_ai_gimini_generate_questions.html"
    )
  );
});
app.post("/gemini-prompt", async (req, res) => {
  const { prompt, numberOfQuestions } = req.body;
  if (!prompt) {
    return res.status(400).send({ error: "No prompt provided" });
  }
  try {
    const text = await callGeminiPrompt(prompt, numberOfQuestions);
    res.json({ response: text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).send({ error: "Failed to generate content" });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
