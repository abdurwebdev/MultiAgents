// src/services/authService.js

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await API.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await API.post("/login", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    const response = await API.post("/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Logout failed" };
  }
};

// Verify Email
export const verifyEmail = async (token) => {
  try {
    const response = await API.get(`/verify/${token}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Verification failed" };
  }
};
//get-me
export const getMe = async () => {
  const res = await API.get("/me");
  return res.data;
};
