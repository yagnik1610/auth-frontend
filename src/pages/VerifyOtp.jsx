import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // 🔐 block direct access
  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  // 🔥 focus first input
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // 🔥 timer
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

  const handleVerify = () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) return;

    localStorage.setItem("token", "dummy_token");

    alert("OTP Verified ✅");
    navigate("/dashboard");
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }

    // 🔥 AUTO VERIFY
    if (index === 3 && value) {
      const finalOtp = [...newOtp].join("");
      if (finalOtp.length === 4) {
        setTimeout(() => handleVerify(), 200);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;

    alert("OTP Resent 🔁");

    setOtp(["", "", "", ""]);
    inputs.current[0]?.focus();

    setTimer(30);
    setCanResend(false);
  };

  const maskedEmail = email
    ? email.replace(/(.{2}).+(@.+)/, "$1****$2")
    : "your email";

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Verify OTP</h2>

        <p className="otp-text">
          Enter the OTP sent to {maskedEmail}
        </p>

        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
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

        <button
          onClick={handleVerify}
          className="login-button"
          disabled={otp.join("").length !== 4}
        >
          Verify OTP
        </button>

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