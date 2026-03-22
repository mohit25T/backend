import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import Modal from "../components/ui/Modal";
import CreateSocietyForm from "../components/societies/CreateSocietyForm";
import SocietyTable from "../components/societies/SocietyTable";
import { fetchSocieties, createSociety } from "../api/societies";

const Societies = () => {
  const [societies, setSocieties] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // ✅ NEW
  const [error, setError] = useState(""); // ✅ NEW

  const loadSocieties = async () => {
    try {
      setError("");
      const res = await fetchSocieties();
      setSocieties(res.data || []);
    } catch (error) {
      console.error("Failed to fetch societies:", error);
      setError("Failed to load societies"); // ✅ NEW
    } finally {
      setInitialLoading(false); // ✅ NEW
    }
  };

  useEffect(() => {
    loadSocieties();
  }, []);

  const handleCreate = async (data) => {
    try {
      setLoading(true);

      await createSociety(data);

      setOpen(false);
      await loadSocieties(); // ✅ ensure fresh data
    } catch (error) {
      console.error("Create society failed:", error);
      setError("Failed to create society"); // ✅ NEW
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageWrapper>

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold">
            Societies
          </h1>

          <button
            onClick={() => setOpen(true)}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            + Create Society
          </button>

        </div>

        {/* ✅ INITIAL LOADING */}
        {initialLoading && (
          <div className="flex justify-center items-center h-32">
            <span className="w-6 h-6 border-2 border-white/20 border-t-primary-500 rounded-full animate-spin"></span>
          </div>
        )}

        {/* ✅ ERROR */}
        {!initialLoading && error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={loadSocieties}
              className="text-xs underline hover:text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* ✅ EMPTY STATE */}
        {!initialLoading && societies.length === 0 && !error && (
          <div className="text-center text-gray-500 py-10">
            No societies found
          </div>
        )}

        {/* ✅ TABLE */}
        {!initialLoading && societies.length > 0 && (
          <SocietyTable
            societies={societies}
            reloadSocieties={loadSocieties}
          />
        )}

        {/* CREATE SOCIETY MODAL */}
        <Modal open={open} onClose={() => setOpen(false)}>

          <CreateSocietyForm
            onSubmit={handleCreate}
            loading={loading}
          />

        </Modal>

      </PageWrapper>
    </AppLayout>
  );
};

export default Societies;