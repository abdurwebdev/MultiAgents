import {
  loginUser,
  registerUser,
  logoutUser,
  verifyEmail,
} from "../services/authService";

import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export const useAuth = () => {
  const { setUser, logout, setLoading } = useAuthStore();
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      setLoading(true);

      const res = await loginUser({ email, password });

      setUser(res.user);
      toast.success("Login successful");

      navigate("/");
    } catch (err) {
      const msg = err?.message;

      if (msg === "Please verify your email before logging in") {
        toast.error("Verify your email first 📩");
      } else {
        toast.error(msg || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);

      await registerUser({ name, email, password });

      toast.success("Account created! Verify email 📩");
    } catch (err) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (token) => {
    try {
      await verifyEmail(token);
      toast.success("Email verified 🎉");
    } catch (err) {
      toast.error(err?.message || "Verification failed");
    }
  };

  const logoutHandler = async () => {
    try {
      await logoutUser();
      logout();
      toast.success("Logged out");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return { login, register, logoutHandler, verify };
};