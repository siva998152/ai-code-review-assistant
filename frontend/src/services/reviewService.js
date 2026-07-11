import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const REVIEW_API = axios.create({
  baseURL: `${API_BASE_URL}/api/reviews`,
});

REVIEW_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const analyzeCode = (codeData) => {
  return REVIEW_API.post("/analyze", codeData);
};

export const getReviewHistory = () => {
  return REVIEW_API.get("/");
};

export const getReviewById = (reviewId) => {
  return REVIEW_API.get(`/${reviewId}`);
};

export const deleteReviewById = (reviewId) => {
  return REVIEW_API.delete(`/${reviewId}`);
};

export const getReviewStats = () => {
  return REVIEW_API.get("/stats");
};