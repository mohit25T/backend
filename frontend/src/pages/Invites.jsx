import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import InviteTable from "../components/invites/InviteTable";
import {
  fetchInvites,
  cancelInvite
} from "../api/invites";

const Invites = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInvites = async () => {
    try {
      setError("");
      const res = await fetchInvites();

      setInvites(res.data || []);
    } catch (error) {
      console.error("Failed to load invites:", error);
      setError("Failed to load invites");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const handleCancel = async (id) => {
    try {
      setLoading(true);
      await cancelInvite(id);
      await loadInvites();
    } catch (error) {
      console.error("Cancel failed:", error);
      setError("Failed to cancel invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageWrapper>

        <h1 className="text-2xl font-bold mb-6">
          Society Invites
        </h1>

        {/* INITIAL LOADING */}
        {initialLoading && (
          <div className="flex justify-center items-center h-32">
            <span className="w-6 h-6 border-2 border-white/20 border-t-primary-500 rounded-full animate-spin"></span>
          </div>
        )}

        {/* ERROR */}
        {!initialLoading && error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={loadInvites}
              className="text-xs underline hover:text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* ACTION LOADING */}
        {loading && (
          <p className="text-sm text-gray-500 mb-2">
            Updating...
          </p>
        )}

        {/* EMPTY STATE */}
        {!initialLoading && invites.length === 0 && !error && (
          <div className="text-center text-gray-500 py-10">
            No invites found
          </div>
        )}

        {/* TABLE */}
        {!initialLoading && invites.length > 0 && (
          <InviteTable
            invites={invites}
            onCancel={handleCancel} // ✅ only cancel now
          />
        )}

      </PageWrapper>
    </AppLayout>
  );
};

export default Invites;