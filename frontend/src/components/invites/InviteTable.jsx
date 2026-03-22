import { motion } from "framer-motion";
import StatusBadge from "../ui/StatusBadge";

const InviteTable = ({ invites = [], onResend, onCancel }) => {
  // 🔥 EMPTY STATE
  if (!invites.length) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-gray-400">
        No invites found
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl shadow-xl overflow-hidden border border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-dark-900/50 backdrop-blur-md border-b border-white/10 text-gray-400 text-sm font-medium">
            <tr>
              <th className="p-4 px-6 text-left">Mobile</th>
              <th className="p-4 px-6 text-left">Email</th>
              <th className="p-4 px-6">Role</th>
              <th className="p-4 px-6">Wing</th>
              <th className="p-4 px-6">Flat</th>
              <th className="p-4 px-6">Society</th>
              <th className="p-4 px-6">Status</th>
              <th className="p-4 px-6">Expires</th>
              <th className="p-4 px-6">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 text-gray-200">
            {invites.map((inv, i) => (
              <motion.tr
                key={inv._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-white/[0.02] transition-colors"
              >
                {/* MOBILE */}
                <td className="p-4 px-6 font-mono text-gray-300">
                  {inv.mobile}
                </td>

                {/* EMAIL */}
                <td className="p-4 px-6 text-sm text-gray-400">
                  {inv.email || "-"}
                </td>

                {/* ROLE */}
                <td className="p-4 px-6">
                  {inv.roles?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {inv.roles.map((role) => (
                        <span
                          key={role}
                          className="px-2 py-0.5 text-xs font-medium bg-primary-500/10 text-primary-300 border border-primary-500/20 rounded-md"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>

                {/* WING */}
                <td className="p-4 px-6">
                  {inv.wing ? (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-dark-800 text-gray-300 border border-white/10 rounded-md">
                      {inv.wing}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                {/* FLAT */}
                <td className="p-4 px-6 text-gray-300 font-medium">
                  {inv.flatNo || "-"}
                </td>

                {/* SOCIETY */}
                <td className="p-4 px-6 text-gray-300">
                  {inv.societyId?.name || "-"}
                </td>

                {/* STATUS */}
                <td className="p-4 px-6">
                  <StatusBadge status={inv.status} />
                </td>

                {/* EXPIRES */}
                <td className="p-4 px-6 text-sm text-gray-500">
                  {inv.expiresAt
                    ? new Date(inv.expiresAt).toLocaleString()
                    : "-"}
                </td>

                {/* ACTIONS */}
                <td className="p-4 px-6 space-x-2">
                  {inv.status === "PENDING" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onResend(inv._id)}
                        className="px-3 py-1.5 rounded-lg font-medium text-sm transition-all bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20"
                      >
                        Resend
                      </button>

                      <button
                        onClick={() => onCancel(inv._id)}
                        className="px-3 py-1.5 rounded-lg font-medium text-sm transition-all bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-600 text-sm italic">
                      Resolved
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InviteTable;