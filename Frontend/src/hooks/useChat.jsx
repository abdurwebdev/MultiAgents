import { useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useSocket } from "../app/hooks/AppSocket";
import { useChatStore } from "../store/chat.store";
import { chatService, authService } from "../services/chatService";

export const useChat = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const chatRef = useRef(null);

  // ─── Zustand Store ───
  const {
    conversations,
    messages,
    activeConversationId,
    status,
    aiMessageTitle,
    humanMessage,
    mobileOpen,
    isLoading,
    setConversations,
    setMessages,
    appendMessage,
    updateLastAIMessage,
    setActiveConversationId,
    setStatus,
    setAiMessageTitle,
    updateConversationTitle,
    addConversation,
    setHumanMessage,
    setMobileOpen,
    setIsLoading,
    resetChat,
  } = useChatStore();

  // ─── Scroll Helper ───
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ═══════════════════════════════════════
  // API LAYER CALLS
  // ═══════════════════════════════════════

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      toast.error("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  }, [setConversations, setIsLoading]);

  const loadMessages = useCallback(async (conversationId) => {
    setIsLoading(true);
    try {
      const formatted = await chatService.getMessages(conversationId);
      setMessages(formatted);
    } catch (err) {
      console.error("Failed to load messages:", err);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [setMessages, setIsLoading]);

  const startNewConversation = useCallback(async () => {
    try {
      const convo = await chatService.startConversation();
      addConversation(convo);
      setActiveConversationId(convo._id);
      resetChat();
      setMobileOpen(false);
      toast.success("New chat started");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to create chat");
    }
  }, [addConversation, setActiveConversationId, resetChat, setMobileOpen]);

  const showAndStartConversation = useCallback(async (id) => {
    setActiveConversationId(id);
    await loadMessages(id);
    setMobileOpen(false);
  }, [setActiveConversationId, loadMessages, setMobileOpen]);

  const logoutUser = useCallback(async () => {
    try {
      await authService.logout();
      toast.success("Logged out");
      navigate("/auth");
    } catch (error) {
      toast.error("Logout failed");
    }
  }, [navigate]);

  // ═══════════════════════════════════════
  // SOCKET MESSAGING
  // ═══════════════════════════════════════

  const sendMessageToNodeViaSocket = useCallback(() => {
    if (!activeConversationId || !humanMessage.trim()) return;

    socket.emit("sendHumanMessage", {
      content: humanMessage,
      conversationId: activeConversationId,
    });

    appendMessage({ type: "human", text: humanMessage });
    setHumanMessage("");
  }, [activeConversationId, humanMessage, socket, appendMessage, setHumanMessage]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") sendMessageToNodeViaSocket();
    },
    [sendMessageToNodeViaSocket]
  );

  // ═══════════════════════════════════════
  // SOCKET LISTENERS
  // ═══════════════════════════════════════

  useEffect(() => {
    if (!socket || !activeConversationId) return;

    const handleAIResponse = ({ conversationId, aiMessage, sources }) => {
      if (conversationId !== activeConversationId) return;
      setStatus("");

      const lastMsg = useChatStore.getState().messages[useChatStore.getState().messages.length - 1];
      
      if (lastMsg?.type === "ai") {
        updateLastAIMessage(aiMessage, sources);
      } else {
        appendMessage({ type: "ai", text: aiMessage, sources: sources || [] });
      }
    };

    const handleAITitle = ({ conversationId, title }) => {
      if (conversationId !== activeConversationId) return;
      setAiMessageTitle(title);
      updateConversationTitle(conversationId, title);
    };

    const handleAIStatus = ({ conversationId, status }) => {
      if (conversationId !== activeConversationId) return;
      setStatus(status);
    };

    socket.on("sendAIResponse", handleAIResponse);
    socket.on("sendAIResponseTitle", handleAITitle);
    socket.on("aiStatus", handleAIStatus);

    return () => {
      socket.off("sendAIResponse", handleAIResponse);
      socket.off("sendAIResponseTitle", handleAITitle);
      socket.off("aiStatus", handleAIStatus);
    };
  }, [activeConversationId, socket, setStatus, setAiMessageTitle, updateLastAIMessage, appendMessage, updateConversationTitle]);

  // ═══════════════════════════════════════
  // INITIAL LOAD
  // ═══════════════════════════════════════

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // ═══════════════════════════════════════
  // RETURN EVERYTHING DASHBOARD NEEDS
  // ═══════════════════════════════════════

  return {
    // Refs
    chatRef,
    
    // State (from store)
    conversations,
    messages,
    activeConversationId,
    status,
    aiMessageTitle,
    humanMessage,
    mobileOpen,
    isLoading,
    
    // Actions
    startNewConversation,
    showAndStartConversation,
    logoutUser,
    sendMessageToNodeViaSocket,
    handleKeyDown,
    setHumanMessage,
    setMobileOpen,
    navigate,
  };
};