import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

app.post("/api/generate", async (req, res) => {
  const { emailContent, tone } = req.body;

  const prompt = `Reply to this email in a ${tone} tone:\n\n"${emailContent}"`;

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        message: prompt,
        model: "command-r-plus", // their best free model
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.text;
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Cohere API failed." });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
