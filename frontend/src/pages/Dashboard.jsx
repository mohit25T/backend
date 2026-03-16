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

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get("/analytics/overview");
        setData(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

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
            <p className="text-gray-400 mt-1 text-sm sm:text-base">Monitor key metrics and usage across all spaces</p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-40">
            <span className="w-8 h-8 border-4 border-white/10 border-t-primary-500 rounded-full animate-spin"></span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard title="Societies" value={data.societies} icon={Building2} color="text-blue-400" bgColor="bg-blue-500/10" />
            <MetricCard title="Admins" value={data.admins} icon={ShieldAlert} color="text-indigo-400" bgColor="bg-indigo-500/10" />
            <MetricCard title="Owners" value={data.owners} icon={UserCheck} color="text-emerald-400" bgColor="bg-emerald-500/10" />
            <MetricCard title="Tenants" value={data.tenants} icon={Users} color="text-amber-400" bgColor="bg-amber-500/10" />
            <MetricCard title="Guards" value={data.guards} icon={ShieldCheck} color="text-rose-400" bgColor="bg-rose-500/10" />
            <MetricCard title="Invites" value={data.invites} icon={MailOpen} color="text-purple-400" bgColor="bg-purple-500/10" />
          </div>
        )}
      </PageWrapper>
    </AppLayout>
  );
};

export default Dashboard;
