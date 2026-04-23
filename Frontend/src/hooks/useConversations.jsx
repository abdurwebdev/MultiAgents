import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { chatService } from "../services/chatService";
import { useChatStore } from "../store/chat.store";

export const useConversations = () => {
  const {
    conversations,
    activeConversationId,
    setConversations,
    setActiveConversationId,
    addConversation,
    resetChat,
    setMobileOpen,
    setIsLoading,
  } = useChatStore();

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await chatService.getConversations();
      setConversations(data);
    } catch {
      toast.error("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startNewConversation = useCallback(async () => {
    try {
      const convo = await chatService.startConversation();
      addConversation(convo);
      setActiveConversationId(convo._id);
      resetChat();
      setMobileOpen(false);
    } catch {
      toast.error("Failed to create chat");
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, []);

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    startNewConversation,
    loadConversations,
  };
};