import { Server } from "socket.io";
import messageModel from "../models/message.model.js";
import {
  generateConversationTitle,
  generateResponse,
} from "../services/aiService.js";
import Conversation from "../models/conversation.model.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on(
      "sendHumanMessage",
      async ({ content, conversationId, fileText }) => {
        try {
          if (!content || !conversationId) return;

          // =========================
          // 1. Get conversation
          // =========================
          const conversation = await Conversation.findById(conversationId);
          if (!conversation) return;

          // =========================
          // 2. Check message history
          // =========================
          const history = await messageModel
            .find({ conversationId })
            .sort({ createdAt: -1 })
            .limit(10);

          const formatedHistory = history.reverse();

          // =========================
          // 3. Save user message
          // =========================
          await messageModel.create({
            conversationId,
            role: "user",
            content,
          });

          // =========================
          // 4. GENERATE TITLE ONLY ON FIRST MESSAGE
          // =========================
          if (!conversation.title || conversation.title === "") {
            const rawTitle = await generateConversationTitle(content);

            // OPTIONAL: streaming effect (clean UX)
            const words = rawTitle.split(" ");
            let current = "";

            for (let i = 0; i < words.length; i++) {
              current += (i === 0 ? "" : " ") + words[i];

              socket.emit("sendAIResponseTitle", {
                conversationId,
                title: current,
              });

              await new Promise((r) => setTimeout(r, 120));
            }

            conversation.title = rawTitle;
            await conversation.save();
          }

          // =========================
          // 5. AI RESPONSE STREAM
          // =========================

          let collectedSources = [];

          const fullAiContent = await generateResponse(
            content,
            (status) => socket.emit("aiStatus", { conversationId, status }),
            (chunk) =>
              socket.emit("sendAIResponse", {
                conversationId,
                aiMessage: chunk,
              }),
            (sources) => {
              collectedSources = sources;
              socket.emit("sendAIResponse", {
                conversationId,
                sources,
              }),
                formatedHistory,
                fileText;
            }
          );

          // =========================
          // 6. Save AI message
          // =========================
          if (fullAiContent?.trim()) {
            await messageModel.create({
              conversationId,
              role: "ai",
              content: fullAiContent,
              sources: collectedSources,
            });
          }

          socket.emit("aiStatus", { conversationId, status: "" });
        } catch (error) {
          console.error("Socket Error:", error.message);
          socket.emit("aiStatus", {
            conversationId,
            status: "error",
          });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
};
