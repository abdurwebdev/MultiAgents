import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  // ─── State ───
  conversations: [],
  messages: [],
  activeConversationId: null,
  status: "",
  aiMessageTitle: "",
  humanMessage: "",
  mobileOpen: false,
  isLoading: false,

  // ─── Getters ───
  getActiveConversation: () => {
    const { conversations, activeConversationId } = get();
    return conversations.find((c) => c._id === activeConversationId);
  },

  // ─── Setters ───
  setConversations: (conversations) => set({ conversations }),
  
  setMessages: (messages) => set({ messages }),
  
  appendMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  
  updateLastAIMessage: (text, sources) => set((state) => {
    const msgs = [...state.messages];
    const last = msgs[msgs.length - 1];
    if (last?.type === "ai") {
      last.text = text || last.text;
      if (sources) last.sources = sources;
    }
    return { messages: msgs };
  }),
  
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  
  setStatus: (status) => set({ status }),
  
  setAiMessageTitle: (title) => set({ aiMessageTitle: title }),
  
  updateConversationTitle: (conversationId, title) => set((state) => ({
    conversations: state.conversations.map((c) =>
      c._id === conversationId ? { ...c, title } : c
    ),
  })),
  
  addConversation: (conversation) => set((state) => ({
    conversations: [conversation, ...state.conversations],
  })),
  
  setHumanMessage: (text) => set({ humanMessage: text }),
  
  setMobileOpen: (open) => set({ mobileOpen: open }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),

  resetChat: () => set({ 
    messages: [], 
    aiMessageTitle: "", 
    status: "" 
  }),
}));