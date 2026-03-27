import { useState } from "react";
import { replaceAdmin } from "../../api/adminReplacement";

const ReplaceAdminModal = ({ admin, onClose, onReplaced }) => {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // 🔥 ADDED

  const handleReplace = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!mobile) {
      setError("Resident mobile number is required");
      return;
    }

    // 🔥 Basic validation
    if (!/^[0-9]{10}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    // 🔥 Prevent replacing with same admin
    if (mobile === admin.mobile) {
      setError("You cannot replace admin with the same user");
      return;
    }

    try {
      setLoading(true);

      await replaceAdmin(admin._id, {
        mobile,
      });

      setSuccess("Admin replaced successfully");

      // 🔥 Slight delay for UX
      setTimeout(() => {
        onReplaced();
      }, 1000);

    } catch (err) {
      console.error("Replace Admin Error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Admin replacement failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl relative border-white/20 animate-fadeIn">

        <h2 className="text-xl font-bold text-red-500 mb-2">
          Replace Admin
        </h2>

        <p className="text-sm text-gray-400 mb-6">
          This will remove admin access from the current admin and promote an
          existing resident as the new admin.
        </p>

        {/* CURRENT ADMIN DETAILS */}
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
          <b className="text-white font-medium">Current Admin:</b> {admin.name} <br />
          <b className="text-white font-medium">Society:</b> {admin.societyId?.name} <br />
          <b className="text-white font-medium">Wing:</b> {admin.wing || "-"} <br />
          <b className="text-white font-medium">Flat:</b> {admin.flatNo || "-"}
        </div>

        <form onSubmit={handleReplace} className="space-y-4">

          {/* MOBILE INPUT */}
          <input
            type="text"
            placeholder="Resident Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="glass-input"
          />

          {/* ERROR */}
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="p-3 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
              {success}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-6">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/25 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Replacing..." : "Confirm Replace"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplaceAdminModal;