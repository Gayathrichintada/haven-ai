import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auth
export const registerUser = (data) =>
  api.post("/register", data);

export const loginUser = (data) =>
  api.post("/login", data);

// Profile
export const createProfile = (data) =>
  api.post("/profile", data);

export const getProfile = (userId) =>
  api.get(`/profile/${userId}`);

export const updateProfile = (userId, data) =>
  api.put(`/profile/${userId}`, data);

export const profileExists = (userId) =>
  api.get(`/profile/${userId}/exists`);

// Chat
export const sendMessage = (formData) =>
  api.post("/chat", formData);

export const getChatSessions = (profileId) =>
  api.get(`/chat-sessions/${profileId}`);

export const getConversation = (
  profileId,
  chatId
) => api.get(`/conversations/${profileId}/${chatId}`);

export const deleteChatSession = (chatId) =>
  api.delete(`/chat-session/${chatId}`);

// Insights
export const getInsights = (profileId) =>
  api.get(`/insights/${profileId}`);

export default api;