import "dotenv/config";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatMistralAI } from "@langchain/mistralai";
import { TavilySearch } from "@langchain/tavily";
import { AIMessage, createAgent, HumanMessage } from "langchain";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import nodemailer from "nodemailer";

import logger from "../config/logger.js";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmailTool = tool(
  async ({ to, subject, message }) => {
    await transporter.sendMail({
      from: `"AI Assistant" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>${subject}</h2>
          <p>${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });

    return `Email sent successfully to ${to}`;
  },
  {
    name: "send_email",
    description:
      "Use this tool when the user asks to send an email. Requires recipient email, subject, and message.",
    schema: z.object({
      to: z.string().email(),
      subject: z.string(),
      message: z.string(),
    }),
  }
);

const tools = [
  new TavilySearch({
    maxResults: 3,
    apiKey: process.env.TAVILY_API_KEY,
  }),
  sendEmailTool,
];

const model = new ChatMistralAI({
  model: "mistral-small",
  apiKey: process.env.MISTRAL_API_KEY,
});

const agent = createAgent({
  model,
  tools,
});

export const generateResponse = async (
  message,
  onStatus,
  onChunk,
  onSources,
  history = []
) => {
  if (!message || !message.trim()) throw new Error("Empty message");
  const lowerMsg = message.toLowerCase();
  if (
    lowerMsg.includes("code") ||
    lowerMsg.includes("react") ||
    lowerMsg.includes("html") ||
    lowerMsg.includes("css") ||
    lowerMsg.includes("javascript") ||
    lowerMsg.includes("node") ||
    lowerMsg.includes("express") ||
    lowerMsg.includes("mongodb")
  ) {
    onStatus("Generating code");
  } else {
    onStatus("Thinking");
  }
  const chatHistory = history.map((msg) => ({
    role: msg.role === "user" ? "user" : "assistant",
    content: msg.content,
  }));

  const eventStream = await agent.stream(
    {
      messages: [
        {
          role: "system",
          content: `
You are an AI assistant.

Rules:
1. If user asks latest news / search / current info -> use Tavily search tool.
2. If user asks to send email -> use send_email tool.
3. If email subject/body missing, generate them professionally.
4. Keep replies helpful and clean.
`,
        },
        ...chatHistory,
        {
          role: "user",
          content: message,
        },
      ],
    },
    { streamMode: "values" }
  );

  let finalContent = "";

  for await (const chunk of eventStream) {
    const messages = chunk.messages;
    const lastMsg = messages[messages.length - 1];

    if (
      lastMsg.additional_kwargs?.tool_calls ||
      lastMsg.tool_calls?.length > 0
    ) {
      const toolName = lastMsg.tool_calls[0].name;
      onStatus(`Using tool: ${toolName}...`);
      continue;
    }

    if (lastMsg._getType() === "tool") {
      try {
        const toolData = JSON.parse(lastMsg.content);

        let results = [];

        // Case 1: direct array
        if (Array.isArray(toolData)) {
          results = toolData;
        }

        // Case 2: object with results array
        else if (toolData.results && Array.isArray(toolData.results)) {
          results = toolData.results;
        }

        // Case 3: object with data array
        else if (toolData.data && Array.isArray(toolData.data)) {
          results = toolData.data;
        }

        const sources = results.map((item) => ({
          title: item.title || "Source",
          url: item.url || item.link || "#",
        }));

        onSources(sources);
      } catch (error) {
        logger.error("Error:- ", error);
      }
    }

    if (lastMsg._getType() === "ai" && lastMsg.content) {
      finalContent = lastMsg.content;
      onChunk(finalContent);
    }
  }

  return finalContent || "Something went wrong.";
};

export const generateConversationTitle = async (message) => {
  const lower = message.toLowerCase();

  // Manual Smart Titles
  if (lower.includes("react")) return "React Project";
  if (lower.includes("node")) return "Node Project";
  if (lower.includes("mongodb")) return "MongoDB Help";
  if (lower.includes("html")) return "HTML Design";
  if (lower.includes("css")) return "CSS Styling";
  if (lower.includes("javascript")) return "JavaScript Help";
  if (lower.includes("bug")) return "Bug Fix";
  if (lower.includes("email")) return "Send Email";
  if (lower.includes("news")) return "Latest News";
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
    Generate a clean chat title.
    
    Rules:
    - Max 4 words
    - Human readable
    - No code syntax
    - No symbols
    - No punctuation
    - No variable names
    - Summarize request simply
    
    Examples:
    React Login Form
    Node Auth Fix
    Portfolio Website
    AI News Today
    `,
    ],
    ["human", "{message}"],
  ]);

  const chain = prompt.pipe(model);

  const response = await chain.invoke({ message });

  let title = response.content.trim();

  // Extra Safety Cleanup
  title = title.replace(/[{}();=<>\[\]`]/g, "");

  return title || "New Chat";
};
