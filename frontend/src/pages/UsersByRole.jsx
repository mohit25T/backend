import api from "../api/axios";
import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import UserTable from "../components/users/UserTable";
import { downloadUsersCSV } from "../api/export";
import EditAdminModal from "../components/admin/EditAdminModal";
import ReplaceAdminModal from "../components/admin/ReplaceAdminModal";

const UsersByRole = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [editingAdmin, setEditingAdmin] = useState(null);
  const [replacingAdmin, setReplacingAdmin] = useState(null);
  const [replaceLoading, setReplaceLoading] = useState(false);

  const [view, setView] = useState("ADMINS");

  const [counts, setCounts] = useState({
    admins: 0,
    owners: 0,
    tenants: 0,
    guards: 0,
  });

  /* ================= LOAD ADMINS ================= */
  const loadAdmins = async () => {
    try {
      const res = await api.get("/users?role=ADMIN");

      const data = res.data || [];

      setAdmins(data);

      setCounts((p) => ({
        ...p,
        admins: data.length,
      }));
    } catch (err) {
      console.error("Failed to load admins:", err);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  /* ================= LOAD USERS ================= */
  const loadUsersByAdmin = async (role) => {
    try {
      if (!selectedAdmin) return;

      const res = await api.get(`/users?role=${role}`);

      const data = res.data || [];

      /* 🔥 FILTER BY SOCIETY + WING */
      const filtered = data.filter(
        (u) =>
          u.societyId?._id === selectedAdmin?.societyId?._id &&
          u.wing === selectedAdmin?.wing
      );

      setUsers(filtered);

      setCounts((p) => ({
        ...p,
        owners: role === "OWNER" ? filtered.length : p.owners,
        tenants: role === "TENANT" ? filtered.length : p.tenants,
        guards: role === "GUARD" ? filtered.length : p.guards,
      }));

      setView(role);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const goBack = () => {
    setSelectedAdmin(null);
    setUsers([]);
    setView("ADMINS");

    setCounts((p) => ({
      ...p,
      owners: 0,
      tenants: 0,
      guards: 0,
    }));
  };

  return (
    <AppLayout>
      <PageWrapper>
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            {view === "ADMINS" && (
              <>
                Admins
                <span className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded">
                  {counts.admins}
                </span>
              </>
            )}

            {view === "OWNER" && (
              <>
                Owners of {selectedAdmin?.name} (Wing {selectedAdmin?.wing})
                <span className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded">
                  {counts.owners}
                </span>
              </>
            )}

            {view === "TENANT" && (
              <>
                Tenants of {selectedAdmin?.name} (Wing {selectedAdmin?.wing})
                <span className="px-2 py-1 text-sm bg-yellow-100 text-yellow-700 rounded">
                  {counts.tenants}
                </span>
              </>
            )}

            {view === "GUARD" && (
              <>
                Guards of {selectedAdmin?.name} (Wing {selectedAdmin?.wing})
                <span className="px-2 py-1 text-sm bg-purple-100 text-purple-700 rounded">
                  {counts.guards}
                </span>
              </>
            )}
          </h1>

          <div className="flex gap-2 flex-wrap">
            {/* EXPORT BUTTONS */}
            {view === "ADMINS" && (
              <button
                onClick={() => downloadUsersCSV("ADMIN")}
                className="px-3 py-1 bg-black text-white rounded text-sm"
              >
                Export Admins CSV
              </button>
            )}

            {view === "OWNER" && (
              <button
                onClick={() => downloadUsersCSV("OWNER")}
                className="px-3 py-1 bg-black text-white rounded text-sm"
              >
                Export Owners CSV
              </button>
            )}

            {view === "TENANT" && (
              <button
                onClick={() => downloadUsersCSV("TENANT")}
                className="px-3 py-1 bg-black text-white rounded text-sm"
              >
                Export Tenants CSV
              </button>
            )}

            {view === "GUARD" && (
              <button
                onClick={() => downloadUsersCSV("GUARD")}
                className="px-3 py-1 bg-black text-white rounded text-sm"
              >
                Export Guards CSV
              </button>
            )}

            {view !== "ADMINS" && (
              <button
                onClick={goBack}
                className="px-3 py-1 border rounded text-sm"
              >
                ← Back
              </button>
            )}
          </div>
        </div>

        {/* ADMIN TABLE */}
        {view === "ADMINS" && (
          <UserTable
            users={admins}
            view={view}
            onEdit={(a) => setEditingAdmin(a)}
            onReplace={(a) => setReplacingAdmin(a)} // ✅ ADDED
            onRowClick={(a) => {
              setSelectedAdmin(a);
              setView("OPTIONS");
            }}
          />
        )}

        {/* OPTIONS */}
        {view === "OPTIONS" && selectedAdmin && (
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => loadUsersByAdmin("OWNER")}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Owners
            </button>

            <button
              onClick={() => loadUsersByAdmin("TENANT")}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Tenants
            </button>

            <button
              onClick={() => loadUsersByAdmin("GUARD")}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Guards
            </button>
          </div>
        )}

        {/* USERS TABLE */}
        {(view === "OWNER" || view === "TENANT" || view === "GUARD") && (
          <UserTable users={users} view={view} />
        )}

        {/* MODALS */}

        {editingAdmin && (
          <EditAdminModal
            admin={editingAdmin}
            onClose={() => setEditingAdmin(null)}
            onUpdated={() => {
              setEditingAdmin(null);
              loadAdmins(); // ✅ cleaner
            }}
          />
        )}

        {replacingAdmin && (
          <ReplaceAdminModal
            admin={replacingAdmin}
            loading={replaceLoading}
            setLoading={setReplaceLoading}
            onClose={() => !replaceLoading && setReplacingAdmin(null)}
            onReplaced={() => {
              loadAdmins(); // ✅ cleaner
              setReplacingAdmin(null);
              setView("ADMINS");
            }}
          />
        )}
      </PageWrapper>
    </AppLayout>
  );
};

export default UsersByRole;