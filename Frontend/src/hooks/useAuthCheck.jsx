// hooks/useAuthCheck.js
import { useEffect } from "react";
import { getMe } from "../services/authService";
import { useAuthStore } from "../store/auth.store";

export const useAuthCheck = () => {
  const { setUser, setAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getMe();
        setUser(res.user); // ✅ logged in
      } catch (err) {
        setAuth(false); // ❌ not logged in
      } finally {
        setLoading(false); // ✅ ALWAYS stop loading
      }
    };

    checkAuth();
  }, []);
};