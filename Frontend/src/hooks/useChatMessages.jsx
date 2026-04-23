import { useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { chatService } from "../services/chatService";
import { useChatStore } from "../store/chat.store";

export const useChatMessages = () => {
  const chatRef = useRef(null);

  const {
    messages,
    setMessages,
    setIsLoading,
  } = useChatStore();

  const loadMessages = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const data = await chatService.getMessages(id);
      setMessages(data);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return {
    messages,
    chatRef,
    loadMessages,
  };
};