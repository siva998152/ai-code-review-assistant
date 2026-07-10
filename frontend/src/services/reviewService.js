import axios from "axios";

const REVIEW_API = axios.create({
  baseURL: "http://localhost:5000/api/reviews",
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