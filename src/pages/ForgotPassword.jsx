import { useState } from "react";
import API from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError("Enter your email");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await API.post("/auth/forgot-password", { email });

      setToast("Reset link sent to your email");

      setTimeout(() => setToast(""), 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-2xl w-[420px] shadow-2xl">

        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 p-3 rounded-xl bg-[#020617] text-white border border-gray-700 
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white 
          bg-gradient-to-r from-indigo-500 to-purple-600
          flex items-center justify-center gap-2
          transition-all duration-300 disabled:opacity-50"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* 🔴 ERROR */}
        {error && (
          <p className="mt-3 text-sm text-red-400 text-center">
            {error}
          </p>
        )}

      </div>

      {/* 🔔 TOAST */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 
        bg-green-500/10 text-green-400 border border-green-500/20
        px-6 py-3 rounded-xl shadow-lg backdrop-blur-md">
          ✔ {toast}
        </div>
      )}
    </div>
  );
}