import { useState } from "react";
import { updateAdminDetails } from "../../api/admin";

const EditAdminModal = ({ admin, onClose, onUpdated }) => {
  const [name, setName] = useState(admin.name || "");
  const [mobile, setMobile] = useState(admin.mobile || "");
  const [email, setEmail] = useState(admin.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {};

      if (name !== admin.name) payload.name = name;
      if (mobile !== admin.mobile) payload.mobile = mobile;
      if (email !== admin.email) payload.email = email;

      // 🔥 Prevent empty update call
      if (Object.keys(payload).length === 0) {
        setMessage("No changes made.");
        setLoading(false);
        return;
      }

      const res = await updateAdminDetails(admin._id, payload);

      if (res.data?.requiresVerification) {
        setMessage(
          "Mobile updated. Admin must verify OTP on next login."
        );
      } else {
        setMessage("Admin details updated successfully.");
      }

      onUpdated();

    } catch (err) {
      console.error("Update Admin Error:", err);

      setMessage(
        err.response?.data?.message ||
        err.message ||
        "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl relative border-white/20">

        <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
          Edit Admin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ADMIN NAME */}
          <input
            type="text"
            placeholder="Admin Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-input"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input"
          />

          {/* MOBILE */}
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="glass-input"
          />

          {/* WING (READ ONLY) */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Wing
            </label>
            <input
              type="text"
              value={admin.wing || "-"}
              disabled
              className="glass-input bg-dark-900/50 text-gray-500 cursor-not-allowed border-white/5 shadow-inner"
            />
          </div>

          {/* FLAT (READ ONLY) */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Flat Number
            </label>
            <input
              type="text"
              value={admin.flatNo || "-"}
              disabled
              className="glass-input bg-dark-900/50 text-gray-500 cursor-not-allowed border-white/5 shadow-inner"
            />
          </div>

          {message && (
            <div className="mb-4 p-4 rounded-xl text-sm border flex justify-center items-center bg-blue-500/10 border-blue-500/20 text-blue-400">
              {message}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-6">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-primary-500/25 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditAdminModal;