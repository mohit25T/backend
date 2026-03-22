import { motion } from "framer-motion";
import { toggleSocietyBlock } from "../../api/block";
import { useState } from "react";

const SocietyTable = ({ societies = [], reloadSocieties }) => {
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(""); // ✅ NEW

  /* 🔥 EMPTY STATE */
  if (!societies.length) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-gray-400">
        <p className="text-lg font-medium">No societies found</p>
        <p className="text-sm mt-1 text-gray-500">
          Create a society to get started
        </p>
      </div>
    );
  }

  const handleToggle = async (id) => {
    try {
      if (loadingId) return; // ✅ prevent double click

      setError("");
      setLoadingId(id);

      await toggleSocietyBlock(id);
      await reloadSocieties();
    } catch (err) {
      console.error("Toggle Society Error:", err);
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="glass-panel rounded-2xl shadow-xl overflow-hidden border border-white/5">

      {/* ✅ ERROR */}
      {error && (
        <div className="m-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-xs underline hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">

          <thead className="bg-dark-900/50 backdrop-blur-md border-b border-white/10 text-gray-400 text-sm font-medium">
            <tr>
              <th className="p-4 px-6">Name</th>
              <th className="p-4 px-6">City</th>
              <th className="p-4 px-6">Wings</th>
              <th className="p-4 px-6">Status</th>
              <th className="p-4 px-6">Created</th>
              <th className="p-4 px-6">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 text-gray-200">
            {societies.map((s, i) => (
              <motion.tr
                key={s._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-white/[0.02] transition-colors"
              >

                {/* NAME */}
                <td className="p-4 px-6 font-semibold text-gray-100">
                  {s.name}
                </td>

                {/* CITY */}
                <td className="p-4 px-6 text-gray-400">
                  {s.city || "-"}
                </td>

                {/* WINGS */}
                <td className="p-4 px-6">
                  {s.wings?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {s.wings.map((wing) => (
                        <span
                          key={wing}
                          className="px-2 py-0.5 text-xs font-semibold bg-dark-800 text-gray-300 border border-white/10 rounded-md"
                        >
                          {wing}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>

                {/* STATUS */}
                <td className="p-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      s.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        s.status === "ACTIVE"
                          ? "bg-emerald-400"
                          : "bg-red-400"
                      }`}
                    ></span>
                    {s.status}
                  </span>
                </td>

                {/* CREATED */}
                <td className="p-4 px-6 text-sm text-gray-400">
                  {s.createdAt
                    ? new Date(s.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })
                    : "-"}
                </td>

                {/* ACTION */}
                <td className="p-4 px-6">
                  <button
                    onClick={() => handleToggle(s._id)}
                    disabled={loadingId === s._id}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      s.status === "ACTIVE"
                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                        : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                    } ${loadingId === s._id ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {loadingId === s._id && (
                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    )}

                    {loadingId === s._id
                      ? "Processing..."
                      : s.status === "ACTIVE"
                      ? "Block"
                      : "Unblock"}
                  </button>
                </td>

              </motion.tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default SocietyTable;