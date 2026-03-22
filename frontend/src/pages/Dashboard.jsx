import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import MetricCard from "../components/ui/MetricCard";
import api from "../api/axios";
import {
  Building2,
  ShieldAlert,
  UserCheck,
  Users,
  ShieldCheck,
  MailOpen
} from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/analytics/overview");

      // ✅ safe fallback
      setData(res.data || {});
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <AppLayout>
      <PageWrapper>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Monitor key metrics and usage across all spaces
            </p>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col justify-center items-center h-40 gap-3">
            <span className="w-8 h-8 border-4 border-white/10 border-t-primary-500 rounded-full animate-spin"></span>
            <p className="text-gray-500 text-sm">
              Loading dashboard...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-xl text-center space-y-3">
            <p>{error}</p>

            {/* ✅ Retry button */}
            <button
              onClick={fetchOverview}
              className="px-4 py-2 text-sm rounded-lg border border-red-500/30 hover:bg-red-500/20 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* DATA */}
        {!loading && !error && data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Societies"
              value={data.societies || 0}
              icon={Building2}
              color="text-blue-400"
              bgColor="bg-blue-500/10"
            />

            <MetricCard
              title="Admins"
              value={data.admins || 0}
              icon={ShieldAlert}
              color="text-indigo-400"
              bgColor="bg-indigo-500/10"
            />

            <MetricCard
              title="Owners"
              value={data.owners || 0}
              icon={UserCheck}
              color="text-emerald-400"
              bgColor="bg-emerald-500/10"
            />

            <MetricCard
              title="Tenants"
              value={data.tenants || 0}
              icon={Users}
              color="text-amber-400"
              bgColor="bg-amber-500/10"
            />

            <MetricCard
              title="Guards"
              value={data.guards || 0}
              icon={ShieldCheck}
              color="text-rose-400"
              bgColor="bg-rose-500/10"
            />

            <MetricCard
              title="Invites"
              value={data.invites || 0}
              icon={MailOpen}
              color="text-purple-400"
              bgColor="bg-purple-500/10"
            />
          </div>
        )}
      </PageWrapper>
    </AppLayout>
  );
};

export default Dashboard;