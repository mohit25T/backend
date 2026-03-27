import { motion } from "framer-motion";

const AuditLogTable = ({ logs = [] }) => {
  return (
    <div className="glass-panel rounded-2xl shadow-xl overflow-hidden border border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-dark-900/50 backdrop-blur-md border-b border-white/10 text-gray-400 text-sm font-medium">
            <tr>
              <th className="p-4 px-6">Date & Time</th>
              <th className="p-4 px-6">User</th>
              <th className="p-4 px-6">Action</th>
              <th className="p-4 px-6">Target</th>
              <th className="p-4 px-6">Description</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 text-gray-200">
            {logs.map((log, i) => (
              <motion.tr
                key={log._id || i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="hover:bg-white/[0.02] transition-colors"
              >
                {/* DATE */}
                <td className="p-4 px-6 text-sm text-gray-400">
                  {new Date(log.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                {/* USER */}
                <td className="p-4 px-6">
                  <span className="font-semibold text-gray-200">
                    {log.userId?.name || "System/Unknown"}
                  </span>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {log.userId?.email || log.userId?.mobile || "-"}
                  </div>
                </td>

                {/* ACTION */}
                <td className="p-4 px-6">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest border bg-primary-500/10 text-primary-400 border-primary-500/20 uppercase">
                    {log.action}
                  </span>
                </td>

                {/* TARGET TYPE */}
                <td className="p-4 px-6 text-sm text-gray-400 capitalize">
                  {log.targetType || "-"}
                </td>

                {/* DESCRIPTION */}
                <td className="p-4 px-6 text-sm text-gray-300 truncate max-w-[300px]">
                  {log.description || "-"}
                </td>

              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogTable;