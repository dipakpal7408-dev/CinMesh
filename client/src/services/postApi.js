import api from "./api";

export const postApi = {
  getFeed: (params = {}) => api.get("/posts", { params }).then((r) => r.data),
  getPost: (id) => api.get(`/posts/${id}`).then((r) => r.data),
  createPost: (formData) =>
    api
      .post("/posts", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),
  deletePost: (id) => api.delete(`/posts/${id}`).then((r) => r.data),
  toggleLike: (id) => api.post(`/posts/${id}/like`).then((r) => r.data),
  toggleSave: (id) => api.post(`/posts/${id}/save`).then((r) => r.data),
  report: (id) => api.post(`/posts/${id}/report`).then((r) => r.data),
  getComments: (postId) => api.get(`/posts/${postId}/comments`).then((r) => r.data),
  addComment: (postId, payload) => api.post(`/posts/${postId}/comments`, payload).then((r) => r.data),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`).then((r) => r.data),
};
