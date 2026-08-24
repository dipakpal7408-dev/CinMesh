import api from "./api";

export const userApi = {
  getProfile: (id) => api.get(`/users/${id}`).then((r) => r.data),
  updateProfile: (payload) => api.put("/users/me", payload).then((r) => r.data),
  updateAvatar: (formData) =>
    api
      .post("/users/me/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),
  toggleFollow: (id) => api.post(`/users/${id}/follow`).then((r) => r.data),
  search: (q) => api.get("/users/search", { params: { q } }).then((r) => r.data),
};

export const communityApi = {
  list: (params = {}) => api.get("/communities", { params }).then((r) => r.data),
  get: (slug) => api.get(`/communities/${slug}`).then((r) => r.data),
  create: (payload) => api.post("/communities", payload).then((r) => r.data),
  toggleJoin: (id) => api.post(`/communities/${id}/join`).then((r) => r.data),
};

export const notificationApi = {
  list: () => api.get("/notifications").then((r) => r.data),
  markRead: (id) => api.put(`/notifications/${id}/read`).then((r) => r.data),
};
