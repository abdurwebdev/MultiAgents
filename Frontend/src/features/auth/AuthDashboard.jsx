import React, { useState } from "react";
import {
  RiMailLine,
  RiLock2Line,
  RiUser3Line,
  RiLoginBoxLine,
  RiUserAddLine,
  RiFlashlightLine,
} from "@remixicon/react";
import { useNavigate } from "react-router";
import { toast, Toaster } from "sonner";

import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/auth.store";

const AuthDashboard = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registered, setRegistered] = useState(false);

  // ✅ hook + store
  const { login, register } = useAuth();
  const { loading } = useAuthStore();

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login(email, password);
        navigate("/");
      } else {
        await register(name, email, password);
        setRegistered(true);
        setIsLogin(true);
        toast.success("Account created! Please verify your email 📩");
      }
    } catch (error) {
      const msg = error?.message;

      if (msg === "Please verify your email before logging in") {
        toast.error("Verify your email first 📩");
      } else {
        toast.error(msg || "Something went wrong");
      }
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />

      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">

        <div className="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-3xl p-8">

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
              <RiFlashlightLine className="text-black" />
            </div>

            <div>
              <h1 className="text-xl font-bold">Luminous AI</h1>
              <p className="text-sm text-gray-400">
                {isLogin ? "Welcome back" : "Create account"}
              </p>
            </div>
          </div>

          {/* EMAIL VERIFICATION INFO */}
          {registered && (
            <div className="text-yellow-400 text-sm text-center mt-3">
              Check your inbox to verify your email
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleAuth} className="space-y-4">

            {/* NAME (REGISTER ONLY) */}
            {!isLogin && (
              <div className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl">
                <RiUser3Line />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="bg-transparent outline-none w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {/* EMAIL */}
            <div className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl">
              <RiMailLine />
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent outline-none w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl">
              <RiLock2Line />
              <input
                type="password"
                placeholder="Password"
                className="bg-transparent outline-none w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold disabled:opacity-50"
            >
              {isLogin ? (
                <>
                  <RiLoginBoxLine className="inline mr-2" />
                  Login
                </>
              ) : (
                <>
                  <RiUserAddLine className="inline mr-2" />
                  Register
                </>
              )}
            </button>
          </form>

          {/* TOGGLE */}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-5 text-sm text-orange-400"
          >
            {isLogin ? "Create new account" : "Already have account? Login"}
          </button>

        </div>
      </div>
    </>
  );
};

export default AuthDashboard;