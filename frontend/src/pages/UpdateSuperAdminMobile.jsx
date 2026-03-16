import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import { useAuth } from "../context/AuthContext";
import { updateSuperAdminMobile } from "../api/updateSuperadminnumber";
import { Phone, PhoneCall } from "lucide-react";

const UpdateSuperAdmin = () => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      const res = await updateSuperAdminMobile({ mobile });

      setMessage(res.data.message);

      // 🔐 AUTO LOGOUT AFTER MOBILE CHANGE
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageWrapper>
        <div className="max-w-md mx-auto mt-12 sm:mt-20">

          <div className="mb-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-6">
              <PhoneCall className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight">
              Update Mobile Number
            </h2>
            <p className="text-gray-400 mt-2 text-sm">Update your secure recovery and contact number.</p>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Mobile Number
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 w-px h-5 bg-white/10" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    className="glass-input pl-20 font-medium tracking-wide"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? "Updating Details..." : "Save Mobile Number"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </PageWrapper>
    </AppLayout>
  );
};

export default UpdateSuperAdmin;
