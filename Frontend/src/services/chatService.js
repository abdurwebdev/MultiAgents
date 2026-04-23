import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/chat",
  withCredentials: true,
});

const authApi = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export const chatService = {
  getConversations: async () => {
    const res = await api.get("/getConversation");
    return res.data.conversations || [];
  },

  getMessages: async (conversationId) => {
    const res = await api.get(`/messages/${conversationId}`);
    return res.data.messages.map((m) => ({
      type: m.role === "user" ? "human" : "ai",
      text: m.content,
      sources: m.sources || [],
    }));
  },

  startConversation: async () => {
    const res = await api.post("/startConversation", {});
    return res.data.conversation;
  },

  sendMessage: async (conversationId, content) => {
    const res = await api.post("/sendMessage", { conversationId, content });
    return res.data;
  },

  deleteConversation: async (conversationId) => {
    const res = await api.delete(`/conversation/${conversationId}`);
    return res.data;
  },

  updateTitle: async (conversationId, title) => {
    const res = await api.patch(`/conversation/${conversationId}`, { title });
    return res.data;
  },
};

export const authService = {
  logout: async () => {
    return await authApi.post("/logout", {});
  },

  getProfile: async () => {
    const res = await authApi.get("/profile");
    return res.data;
  },
};