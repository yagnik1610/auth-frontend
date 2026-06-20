import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");        // 🔴 inline error
  const [toast, setToast] = useState("");        // 🔔 success toast
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error on typing
  };

  const handleRegister = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      form.password !== form.confirmPassword
    ) {
      setError("Check your inputs");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        username: form.name,
        email: form.email,
        password: form.password,
      });

      // 🔔 SUCCESS TOAST
      setToast("OTP sent to your email");

      setTimeout(() => {
        setToast("");
        navigate("/verify-otp", {
          state: { email: form.email },
        });
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-2xl w-[420px] shadow-2xl">

        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Register
        </h2>

        <input
          name="name"
          placeholder="Name"
          className="w-full mb-3 p-3 rounded-xl bg-[#020617] text-white border border-gray-700 
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded-xl bg-[#020617] text-white border border-gray-700 
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-3 rounded-xl bg-[#020617] text-white border border-gray-700 
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
          onChange={handleChange}
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-4 p-3 rounded-xl bg-[#020617] text-white border border-gray-700 
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none"
          onChange={handleChange}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white 
          bg-gradient-to-r from-indigo-500 to-purple-600
          flex items-center justify-center gap-2
          transition-all duration-300 hover:scale-105 disabled:opacity-50"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? "Registering..." : "Register"}
        </button>

        {/* 🔴 INLINE ERROR (BELOW BUTTON) */}
        {error && (
        <p className="mt-3 text-sm text-red-400 text-center">
        {error}
        </p>
        )}

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>

      {/* 🔔 TOAST (BOTTOM CENTER) */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 
        bg-green-500/10 text-green-400 border border-green-500/20
        px-6 py-3 rounded-xl shadow-lg backdrop-blur-md
        animate-fade-in">
          ✔ {toast}
        </div>
      )}
    </div>
  );
}