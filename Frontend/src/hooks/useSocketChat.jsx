import { useEffect, useCallback } from "react";
import { useSocket } from "../app/hooks/AppSocket";
import { useChatStore } from "../store/chat.store";

export const useSocketChat = () => {
  const socket = useSocket();

  const {
    activeConversationId,
    humanMessage,
    appendMessage,
    updateLastAIMessage,
    setHumanMessage,
    setStatus,
    setAiMessageTitle,
    updateConversationTitle,
  } = useChatStore();

  const sendMessage = useCallback(() => {
    if (!humanMessage.trim() || !activeConversationId) return;

    socket.emit("sendHumanMessage", {
      content: humanMessage,
      conversationId: activeConversationId,
    });

    appendMessage({
      type: "human",
      text: humanMessage,
    });

    setHumanMessage("");
  }, [humanMessage, activeConversationId]);

  useEffect(() => {
    const aiResponse = ({ conversationId, aiMessage, sources }) => {
      if (conversationId !== activeConversationId) return;

      const msgs = useChatStore.getState().messages;
      const last = msgs[msgs.length - 1];

      if (last?.type === "ai") {
        updateLastAIMessage(aiMessage, sources);
      } else {
        appendMessage({
          type: "ai",
          text: aiMessage,
          sources,
        });
      }
    };

    const aiTitle = ({ conversationId, title }) => {
      if (conversationId !== activeConversationId) return;
      setAiMessageTitle(title);
      updateConversationTitle(conversationId, title);
    };

    const aiStatus = ({ conversationId, status }) => {
      if (conversationId !== activeConversationId) return;
      setStatus(status);
    };

    socket.on("sendAIResponse", aiResponse);
    socket.on("sendAIResponseTitle", aiTitle);
    socket.on("aiStatus", aiStatus);

    return () => {
      socket.off("sendAIResponse", aiResponse);
      socket.off("sendAIResponseTitle", aiTitle);
      socket.off("aiStatus", aiStatus);
    };
  }, [activeConversationId]);

  return { sendMessage };
};