import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import AuditLogTable from "../components/audit/AuditLogTable";
import AuditLogFilters from "../components/audit/AuditLogFilters";
import { fetchAuditLogs } from "../api/auditLogs";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [action, setAction] = useState("");
  const [dateRange, setDateRange] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        const res = await fetchAuditLogs();
        setLogs(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  /* =============================
     AVAILABLE ACTIONS
  ============================= */

  const availableActions = useMemo(() => {
    return [...new Set(logs.map((l) => l.action).filter(Boolean))];
  }, [logs]);

  /* =============================
     FILTER LOGS
  ============================= */

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const logDate = new Date(log.createdAt);
      const now = new Date();

      if (action && log.action !== action) return false;

      if (dateRange === "TODAY") {
        return logDate.toDateString() === now.toDateString();
      }

      if (dateRange === "7_DAYS") {
        const diffDays = Math.floor(
          (now - logDate) / (1000 * 60 * 60 * 24)
        );
        return diffDays <= 7;
      }

      return true;
    });
  }, [logs, action, dateRange]);

  return (
    <AppLayout>
      <PageWrapper>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight mb-8">
          System Audit Logs
        </h1>

        <AuditLogFilters
          action={action}
          setAction={setAction}
          dateRange={dateRange}
          setDateRange={setDateRange}
          availableActions={availableActions}
        />

        {/* ERROR */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6 flex items-center gap-3">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-2xl">
            <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-400 font-medium animate-pulse">
              Loading secure audit logs...
            </p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center border border-white/5">
            <p className="text-xl font-medium text-gray-300">
              No audit records found
            </p>
            <p className="text-gray-500 mt-2">
              Try adjusting your filter criteria.
            </p>
          </div>
        ) : (
          <AuditLogTable logs={filteredLogs} />
        )}
      </PageWrapper>
    </AppLayout>
  );
};

export default AuditLogs;