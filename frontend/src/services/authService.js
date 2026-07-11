import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// Automatically attach JWT token to protected requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register
export const registerUser = (userData) => {
  return API.post("/register", userData);
};

// Login
export const loginUser = (userData) => {
  return API.post("/login", userData);
};

// Forgot Password
export const forgotPassword = (emailData) => {
  return API.post("/forgot-password", emailData);
};

// Reset Password
export const resetPassword = (resetData) => {
  return API.post("/reset-password", resetData);
};

// Get logged-in user's profile
export const getProfile = () => {
  return API.get("/profile");
};

// Update logged-in user's profile
export const updateProfile = (profileData) => {
  return API.put("/profile", profileData);
};

// Change logged-in user's password
export const changePassword = (passwordData) => {
  return API.put("/change-password", passwordData);
};