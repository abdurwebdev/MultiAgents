import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  RiUser3Line,
  RiLockPasswordLine,
  RiArrowLeftLine,
  RiFlashlightLine,
  RiMenu3Line,
  RiCloseLine,
  RiDashboardLine,
  RiMessage3Line,
  RiLogoutBoxLine,
} from "@remixicon/react";
import { useUser } from "../../hooks/useUser";
import { useUserStore } from "../../store/user.store";
import { authService } from "../../services/chatService";

const Profile = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const {
    profile,
    loading,
    saving,
    fetchProfile,
    updateUserProfile,
    updatePassword,
  } = useUser();

  const { setProfile } = useUserStore();

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const logoutUser = async () => {
    try {
      await authService.logout();
      toast.success("Logged out");
      navigate("/auth");
    } catch {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#050505] font-['Gilroy']">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
            <RiFlashlightLine className="text-black" />
          </div>
          <span className="text-gray-400 text-sm">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#050505] text-white font-['Gilroy'] overflow-hidden">
      {/* ═══════════════════════════════════════
          MOBILE TOP BAR
      ═══════════════════════════════════════ */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 border-b border-white/10 bg-[#0b0b0b] z-50">
        <RiMenu3Line
          className="text-gray-300 cursor-pointer hover:text-white transition-colors"
          onClick={() => setMobileOpen(true)}
        />
        <span className="font-semibold text-sm">Luminous AI</span>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
          <RiFlashlightLine size={16} className="text-black" />
        </div>
      </div>

      {/* ═══════════════════════════════════════
          SIDEBAR (Shared with Dashboard)
      ═══════════════════════════════════════ */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-[280px]
        bg-[#0b0b0b] border-r border-white/10 flex flex-col
        transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Close button (mobile only) */}
        <div className="md:hidden p-4 flex justify-end">
          <RiCloseLine
            className="text-gray-400 cursor-pointer hover:text-white"
            onClick={() => setMobileOpen(false)}
          />
        </div>

        <div className="p-5 flex-1 overflow-y-auto custom-scroll">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
              <RiFlashlightLine />
            </div>
            <h1 className="text-lg font-semibold">Luminous AI</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 mb-6">
            <button
              onClick={() => {
                navigate("/");
                setMobileOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <RiMessage3Line size={18} />
              Chats
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 text-white border-l-2 border-orange-500 text-sm"
            >
              <RiUser3Line size={18} />
              Profile
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all text-sm font-medium"
          >
            <RiLogoutBoxLine size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════ */}
      <main className="flex-1 flex flex-col md:ml-0 pt-14 md:pt-0 overflow-hidden">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scroll">
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
            
            {/* Back Button + Title (Mobile friendly) */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="md:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <RiArrowLeftLine />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                  <RiUser3Line className="text-black" size={20} />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold">Profile Settings</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Manage your account preferences</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "profile"
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "security"
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Security
              </button>
            </div>

            {/* ═══ GENERAL TAB ═══ */}
            {activeTab === "profile" && (
              <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-5 md:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <RiUser3Line className="text-orange-400" size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    <p className="text-xs text-gray-500">Update your name and email address</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
                      Full Name
                    </label>
                    <input
                      value={profile?.name || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-600 text-sm"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
                      Email Address
                    </label>
                    <input
                      value={profile?.email || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-600 text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => updateUserProfile(profile)}
                    disabled={saving}
                    className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ═══ SECURITY TAB ═══ */}
            {activeTab === "security" && (
              <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-5 md:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <RiLockPasswordLine className="text-orange-400" size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Change Password</h2>
                    <p className="text-xs text-gray-500">Update your password to keep your account secure</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-600 text-sm"
                      onChange={(e) =>
                        setPasswords({ ...passwords, oldPassword: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-600 text-sm"
                      onChange={(e) =>
                        setPasswords({ ...passwords, newPassword: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => updatePassword(passwords)}
                    className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all text-sm"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 md:hidden z-30"
        />
      )}

      {/* Scrollbar Styles */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default Profile;