import { useEffect } from "react";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/userService";

import { useUserStore } from "../store/user.store";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export const useUser = () => {
  const {
    profile,
    setProfile,
    loading,
    setLoading,
    saving,
    setSaving,
  } = useUserStore();

  const navigate = useNavigate();

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE PROFILE
  const updateUserProfile = async (payload) => {
    try {
      setSaving(true);

      const res = await updateProfile(payload);

      toast.success(res.message);

      if (res.message?.toLowerCase().includes("verify")) {
        setTimeout(() => navigate("/auth"), 800);
      }

      if (res.user) setProfile(res.user);
    } catch (err) {
      const data = err.response?.data;

      if (Array.isArray(data?.errors)) {
        data.errors.forEach((e) => toast.error(e.message));
      } else {
        toast.error(data?.message || "Update failed");
      }
    } finally {
      setSaving(false);
    }
  };

  // CHANGE PASSWORD
  const updatePassword = async (payload) => {
    try {
      const res = await changePassword(payload);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  return {
    profile,
    loading,
    saving,
    fetchProfile,
    updateUserProfile,
    updatePassword,
  };
};