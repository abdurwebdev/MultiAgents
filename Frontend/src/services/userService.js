import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/user",
  withCredentials: true,
});

// Get profile
export const getProfile = async () => {
  const res = await API.get("/profile");
  return res.data.user;
};

// Update profile
export const updateProfile = async (data) => {
  const res = await API.put("/update-profile", data);
  return res.data;
};

// Change password
export const changePassword = async (data) => {
  const res = await API.put("/change-password", data);
  return res.data;
};