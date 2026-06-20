import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const [error, setError] = useState("");   // 🔴 inline error
  const [toast, setToast] = useState("");   // 🔔 success toast

  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) navigate("/");
  }, [email, navigate]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return;

    try {
      setStatus("loading");
      setError("");

      await API.post("/auth/verify-email", {
        email,
        otp: finalOtp,
      });

      setStatus("success");

      // 🔔 SUCCESS TOAST
      setToast("OTP verified successfully");

      setTimeout(() => {
        setToast("");
        navigate("/");
      }, 1500);

    } catch (err) {
      setStatus("error");

      // 🔴 INLINE ERROR
      setError(err.response?.data?.message || "Invalid OTP");

      setTimeout(() => {
        setStatus("idle");
      }, 1500);
    }
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-2xl w-[460px] shadow-2xl text-center">

        <h2 className="text-2xl font-semibold text-white mb-2">
          Verify OTP
        </h2>

        <p className="text-gray-400 text-sm mb-4">
          OTP sent to {email}
        </p>

        {/* ❌ REMOVED GREEN SUCCESS TEXT */}

        {/* OTP BOXES */}
        <div className="flex justify-center items-center gap-2 md:gap-3 mb-8 px-2">
          {otp.map((d, i) => (
            <input
              key={i}
              maxLength="1"
              value={d}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              ref={(el) => (inputs.current[i] = el)}
              className={`w-12 h-12 md:w-14 md:h-14
              text-xl md:text-2xl font-medium text-center
              rounded-xl
              bg-[#020617] text-white

              border border-gray-700
              outline-none

              transition-all duration-200

              focus:border-indigo-500
              focus:ring-1 focus:ring-indigo-500

              ${status === "loading" ? "border-indigo-500 shadow-[0_0_12px_#6366f1]" : ""}
              ${status === "success" ? "border-green-500 shadow-[0_0_12px_#22c55e]" : ""}
              ${status === "error" ? "border-red-500 shadow-[0_0_12px_#ef4444]" : ""}
              `}
            />
          ))}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleVerify}
          disabled={otp.join("").length !== 6 || status === "loading"}
          className="w-full py-3 rounded-xl font-medium text-white 
          bg-gradient-to-r from-indigo-500 to-purple-600
          flex items-center justify-center gap-2
          transition-all duration-200 disabled:opacity-50"
        >
          {status === "loading" && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}

          {status === "loading" ? "Verifying..." : "Verify OTP"}
        </button>

        {/* 🔴 INLINE ERROR */}
        {error && (
          <p className="mt-3 text-sm text-red-400 text-center">
            {error}
          </p>
        )}

      </div>

      {/* 🔔 TOAST (BOTTOM CENTER) */}
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