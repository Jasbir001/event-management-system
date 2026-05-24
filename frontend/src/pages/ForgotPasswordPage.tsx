// src/pages/ForgotPasswordPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, ArrowLeft, Mail } from "lucide-react";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; msg: string }>({
    type: "idle",
    msg: ""
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus({ type: "loading", msg: "Sending OTP to your email..." });

    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/send-otp` : '/api/send-otp';
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus({ type: "success", msg: data.msg || "OTP sent successfully!" });
        setStep(2);
      } else {
        setStatus({ type: "error", msg: data.msg || "Failed to send OTP." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Failed to connect to the server." });
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", msg: "Passwords do not match." });
      return;
    }

    setStatus({ type: "loading", msg: "Verifying OTP and updating password..." });

    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/verify-otp` : '/api/verify-otp';
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus({ type: "success", msg: "Successfully password updated. Redirecting to login..." });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setStatus({ type: "error", msg: data.msg || "Failed to verify OTP or reset password." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Failed to connect to the server." });
    }
  };

  return (
    <div className="page-shell flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="form-card">
          <div className="form-card-header flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
            {step === 1 ? <Mail className="h-5 w-5" /> : <KeyRound className="h-5 w-5" />}
            <span>{step === 1 ? "Forgot Password" : "Reset Password"}</span>
          </div>
          <div className="p-6 md:p-8">
            {status.type !== "idle" && (
              <div className={`mb-6 rounded-xl p-4 text-sm font-medium ${status.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : status.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                {status.msg}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in zoom-in duration-300">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Account Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                  />
                  <p className="mt-2 text-xs text-gray-500">We will send a 6-digit OTP to this email.</p>
                </div>
                
                <button 
                  type="submit" 
                  disabled={status.type === "loading"} 
                  className="btn-gradient w-full disabled:opacity-70"
                >
                  {status.type === "loading" ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndReset} className="space-y-4 animate-in fade-in zoom-in duration-300">
                <div>
                  <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    className="input-field text-center font-mono tracking-[0.5em] text-lg"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="------"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    className="input-field"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    className="input-field"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={status.type === "loading"} 
                  className="btn-gradient w-full disabled:opacity-70"
                >
                  {status.type === "loading" ? "Verifying..." : "Verify OTP & Reset"}
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="inline-flex items-center gap-1 font-medium text-gray-500 transition-colors hover:text-blue-700">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
