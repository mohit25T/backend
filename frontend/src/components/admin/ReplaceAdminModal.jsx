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
      <div className="bg-white rounded-xl w-full max-w-md p-6 animate-fadeIn shadow-lg">

        <h2 className="text-xl font-bold text-red-600 mb-2">
          Replace Admin
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          This will remove admin access from the current admin and promote an
          existing resident as the new admin.
        </p>

        {/* CURRENT ADMIN DETAILS */}
        <div className="bg-red-50 border border-red-200 p-3 rounded mb-4 text-sm">
          <b>Current Admin:</b> {admin.name} <br />
          <b>Society:</b> {admin.societyId?.name} <br />
          <b>Wing:</b> {admin.wing || "-"} <br />
          <b>Flat:</b> {admin.flatNo || "-"}
        </div>

        <form onSubmit={handleReplace} className="space-y-4">

          {/* MOBILE INPUT */}
          <input
            type="text"
            placeholder="Resident Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border p-2 rounded
                       focus:outline-none
                       focus:ring-2 focus:ring-red-400"
          />

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* SUCCESS */}
          {success && (
            <p className="text-sm text-green-600">{success}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded
                         hover:bg-gray-100
                         disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2
                         px-5 py-2 rounded
                         bg-red-600 text-white
                         hover:bg-red-700
                         disabled:opacity-60"
            >
              {loading && (
                <span
                  className="w-4 h-4 border-2 border-white
                             border-t-transparent
                             rounded-full animate-spin"
                />
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