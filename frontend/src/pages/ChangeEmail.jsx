import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { requestEmailChange, verifyEmailChange } from "../api/changeEmail";
import api from "../api/axios";
import { Mail, ShieldCheck, KeyRound } from "lucide-react";

const ChangeEmail = () => {
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  /* ==========================
     FETCH CURRENT EMAIL
  ========================== */
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await api.get("/auth/me");
        setOldEmail(res.data?.email || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load current email");
      }
    };

    fetchEmail();
  }, []);

  /* ==========================
     STEP 1: REQUEST CHANGE
  ========================== */
  const requestChange = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newEmail) {
      setError("New email is required");
      return;
    }

    // ✅ email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setError("Enter a valid email address");
      return;
    }

    if (newEmail === oldEmail) {
      setError("New email must be different from current email");
      return;
    }

    try {
      setLoading(true);

      await requestEmailChange({
        oldEmail,
        newEmail,
      });

      setMessage("Secure OTP sent to your current email");
      setStep(2);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================
     STEP 2: VERIFY OTP
  ========================== */
  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("OTP is required");
      return;
    }

    // ✅ OTP validation
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await verifyEmailChange({ otp });

      setMessage("Email updated successfully. Redirecting to login...");

      setTimeout(() => {
        logout();
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageWrapper>
        <div className="max-w-md mx-auto mt-12 sm:mt-20">

          <div className="mb-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight">
              Change Email Address
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Securely update your administrator email using OTP verification.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-xl relative mt-4">

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                {message}
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <form onSubmit={requestChange} className="space-y-5">

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Current Enrolled Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <input
                      type="email"
                      value={oldEmail || "Loading..."}
                      disabled
                      className="glass-input pl-12 bg-dark-900/50 text-gray-500 cursor-not-allowed border-white/5 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                    <input
                      type="email"
                      placeholder="e.g. yourname@company.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="glass-input pl-12"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !oldEmail}
                    className="btn-primary"
                  >
                    {loading ? "Sending Secure OTP..." : "Send Verification OTP"}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form onSubmit={verifyOtp} className="space-y-5">

                <div className="text-center text-sm text-gray-400 mb-6">
                  Please enter the 6-digit confirmation code we sent to <br />
                  <span className="text-primary-400 font-medium">{oldEmail}</span>
                </div>

                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="glass-input pl-12 text-center text-lg font-mono tracking-widest"
                    maxLength={6}
                    autoFocus
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-success"
                  >
                    {loading ? "Verifying..." : "Verify & Update Email"}
                  </button>
                </div>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setError("");
                      setMessage("");
                    }}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2"
                  >
                    Back to previous step
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </PageWrapper>
    </AppLayout>
  );
};

export default ChangeEmail;