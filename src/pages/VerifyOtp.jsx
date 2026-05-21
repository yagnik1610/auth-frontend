import { useRef, useState, useEffect } from "react";
import "./Login.css";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);

  // 🔥 TIMER STATE
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // 🔥 auto focus first input
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // 🔥 TIMER LOGIC
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next
    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) {
      alert("Enter complete OTP ❌");
      return;
    }

    console.log("OTP:", finalOtp);
    alert("OTP Verified ✅");
  };

  // 🔥 UPDATED RESEND FUNCTION
  const handleResend = () => {
    if (!canResend) return;

    alert("OTP Resent 🔁");

    setTimer(30);
    setCanResend(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Verify OTP</h2>

        <p className="otp-text">
          Enter the OTP sent to your email
        </p>

        {/* OTP INPUTS */}
        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              className="otp-input"
              value={digit}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              ref={(el) => (inputs.current[index] = el)}
            />
          ))}
        </div>

        <button onClick={handleVerify} className="login-button">
          Verify OTP
        </button>

        {/* 🔥 TIMER UI */}
        {canResend ? (
          <p className="resend-text" onClick={handleResend}>
            Resend OTP
          </p>
        ) : (
          <p className="resend-text disabled">
            Resend OTP in {timer}s
          </p>
        )}
      </div>
    </div>
  );
}