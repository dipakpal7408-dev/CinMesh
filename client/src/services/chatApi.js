import api from "./api";

export const chatApi = {
  getMyChats: () => api.get("/chats").then((r) => r.data),
  accessOneToOne: (userId) => api.post("/chats/one-to-one", { userId }).then((r) => r.data),
  createGroup: (name, memberIds) => api.post("/chats/group", { name, memberIds }).then((r) => r.data),
  getMessages: (chatId, before) =>
    api.get(`/chats/${chatId}/messages`, { params: before ? { before } : {} }).then((r) => r.data),
  markSeen: (chatId) => api.put(`/chats/${chatId}/seen`).then((r) => r.data),
  sendMessage: (formData) =>
    api
      .post("/messages", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),
};
