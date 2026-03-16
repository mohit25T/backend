import { toggleAdminBlock } from "../../api/block";

const UserTable = ({
  users,
  view,
  onRowClick,
  onEdit,
  onReplace,
  onStatusChange,
}) => {
  return (
    <div className="glass-panel rounded-2xl shadow-xl overflow-hidden border border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-dark-900/50 backdrop-blur-md border-b border-white/10 text-gray-400 text-sm font-medium">
            <tr align="center">
              <th className="p-4 px-6 text-left">Name</th>
              <th className="p-4 px-6 text-left">Email</th>
              <th className="p-4 px-6">Mobile</th>
              <th className="p-4 px-6">Role</th>
              <th className="p-4 px-6">Society</th>
              <th className="p-4 px-6">Status</th>
              {view === "ADMINS" && <th className="p-4 px-6">Actions</th>}
            </tr>
          </thead>

          <tbody align="center" className="divide-y divide-white/5 text-gray-200">
            {users.map((u) => (
              <tr
                key={u._id}
                onClick={() => {
                  if (view === "ADMINS") onRowClick?.(u);
                }}
                className={`transition-colors ${view === "ADMINS" ? "cursor-pointer hover:bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
              >
                <td className="p-4 px-6 text-left font-semibold text-gray-100">{u.name || "-"}</td>

                <td className="p-4 px-6 text-left text-sm text-gray-400">
                  {u.email || "-"}
                </td>

                <td className="p-4 px-6 text-gray-300 font-mono text-sm">{u.mobile}</td>
                
                <td className="p-4 px-6">
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {u.roles.map(role => (
                      <span key={role} className="px-2 py-0.5 text-xs font-medium bg-primary-500/10 text-primary-300 border border-primary-500/20 rounded-md">
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                
                <td className="p-4 px-6 text-gray-300">{u.societyId?.name || "-"}</td>

                <td className="p-4 px-6">
                  <span
                    className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      u.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.status === "ACTIVE" ? "bg-emerald-400" : "bg-red-400"}`}></span>  
                    {u.status}
                  </span>
                </td>

                {view === "ADMINS" && (
                  <td className="p-4 px-6">
                    <div className="flex justify-center items-center gap-2">
                      {/* EDIT */}
                      {u.roles.includes("ADMIN") && onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(u);
                          }}
                          className="px-3 py-1.5 rounded-lg font-medium text-sm transition-all bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20 flex items-center gap-1.5"
                        >
                          ✏️ Edit
                        </button>
                      )}

                      {/* BLOCK / UNBLOCK */}
                      {u.roles.includes("ADMIN") && onStatusChange && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await toggleAdminBlock(u._id);
                            onStatusChange();
                          }}
                          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5 border
                            ${
                              u.status === "ACTIVE"
                                ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            }`}
                        >
                          {u.status === "ACTIVE" ? "🚫 Block" : "✅ Unblock"}
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;