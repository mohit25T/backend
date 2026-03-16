const AuditLogTable = ({ logs }) => {
  return (
    <div className="glass-panel rounded-2xl shadow-xl overflow-hidden border border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap text-sm">
          <thead className="bg-dark-900/50 backdrop-blur-md border-b border-white/10 text-gray-400 font-medium">
            <tr>
              <th className="p-4 px-6">Action</th>
              <th className="p-4 px-6">Performed By</th>
              {/* <th className="p-4 px-6">Description</th> */}
              <th className="p-4 px-6">Time</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 text-gray-200">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20">
                    {log.action}
                  </span>
                </td>

                <td className="p-4 px-6">
                  <div className="font-semibold text-gray-200">
                    {log.performedBy?.name || "System"}
                  </div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    {log.performedByRole}
                  </div>
                </td>

                {/* <td className="p-4 px-6 text-gray-400">
                  {log.description}
                </td> */}

                <td className="p-4 px-6 text-sm text-gray-400">
                  {new Date(log.createdAt).toLocaleString(undefined, { 
                    year: 'numeric', month: 'short', day: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogTable;
