/**
 * Технологии, с которыми мы работаем.
 * Категории: ИИ и нейросети, Frontend, Backend, Мобильная разработка, Автоматизация.
 */

export type TechCategory = {
  id: string;
  title: string;
  items: string[];
};

export const TECH_CATEGORIES: TechCategory[] = [
  {
    id: "ai",
    title: "ИИ и нейросети",
    items: [
      "OpenAI GPT",
      "Claude",
      "Gemini",
      "Llama",
      "Mistral",
      "Grok",
      "Cohere",
      "Groq",
      "Together AI",
      "Anthropic",
      "Replicate",
      "Hugging Face",
      "LangChain",
      "LangGraph",
      "RAG / Embeddings",
      "Whisper",
      "ElevenLabs",
      "Stable Diffusion",
      "DALL·E",
      "Midjourney API",
      "Runway",
      "Pika",
      "Perplexity API",
      "Fireworks AI",
      "Ollama",
      "vLLM",
      "Google AI",
      "YandexGPT",
      "GigaChat",
      "Kandinsky",
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    items: ["React", "Vue.js", "Angular", "JavaScript", "TypeScript", "Next.js", "Tailwind", "Vercel"],
  },
  {
    id: "backend",
    title: "Backend",
    items: ["Python", "Node.js", "PHP", "Symfony", "Laravel", "C#", "Go", "Java", "Ruby", "Yii", "FastAPI"],
  },
  {
    id: "mobile",
    title: "Мобильная разработка",
    items: ["React Native", "Flutter", "Swift", "Kotlin", "Telegram Mini Apps"],
  },
  {
    id: "automation",
    title: "Автоматизация и данные",
    items: [
      "n8n",
      "Zapier",
      "Make",
      "CRM (amoCRM, Bitrix24)",
      "Google Sheets",
      "Notion",
      "Airtable",
      "Webhooks",
      "REST API",
    ],
  },
];
