import { motion } from "framer-motion";
import { ListFilter, Calendar as CalendarIcon } from "lucide-react";

const AuditLogFilters = ({
  action,
  setAction,
  dateRange,
  setDateRange,
  availableActions = []
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 items-end bg-dark-800/50 p-4 rounded-xl border border-white/5">

      {/* Action Filter */}
      <div className="flex flex-col flex-1 min-w-[200px]">
        <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
          <ListFilter className="w-4 h-4" />
          Filter by Action
        </label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="glass-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat"
        >
          <option value="" className="bg-dark-900 text-gray-300">All Actions</option>
          {availableActions.map((a) => (
            <option key={a} value={a} className="bg-dark-900 text-gray-300">
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Date Filter */}
      <div className="flex flex-col flex-1 min-w-[200px]">
        <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          Date Range
        </label>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="glass-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat"
        >
          <option value="ALL" className="bg-dark-900 text-gray-300">All Time</option>
          <option value="TODAY" className="bg-dark-900 text-gray-300">Today</option>
          <option value="7_DAYS" className="bg-dark-900 text-gray-300">Last 7 Days</option>
        </select>
      </div>

    </div>
  );
};

export default AuditLogFilters;