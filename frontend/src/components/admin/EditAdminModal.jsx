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
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">

        <h2 className="text-xl font-bold mb-4">
          Edit Admin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ADMIN NAME */}
          <input
            type="text"
            placeholder="Admin Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />

          {/* MOBILE */}
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />

          {/* WING (READ ONLY) */}
          <div>
            <label className="text-sm text-gray-500">
              Wing
            </label>
            <input
              type="text"
              value={admin.wing || "-"}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {/* FLAT (READ ONLY) */}
          <div>
            <label className="text-sm text-gray-500">
              Flat Number
            </label>
            <input
              type="text"
              value={admin.flatNo || "-"}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {message && (
            <p className="text-sm text-blue-600">
              {message}
            </p>
          )}

          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded hover:opacity-90 transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditAdminModal;