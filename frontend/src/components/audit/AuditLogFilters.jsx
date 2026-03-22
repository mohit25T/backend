const AuditLogFilters = ({
  action,
  setAction,
  dateRange,
  setDateRange,
  availableActions = []
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center">

      {/* Action Filter */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">
          Action
        </label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">All Actions</option>
          {availableActions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Date Filter */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">
          Date Range
        </label>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="ALL">All Time</option>
          <option value="TODAY">Today</option>
          <option value="7_DAYS">Last 7 Days</option>
        </select>
      </div>

    </div>
  );
};

export default AuditLogFilters;