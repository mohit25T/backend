import { Building, MapPin, Calendar, CheckCircle2, XCircle, CreditCard, Home, List } from "lucide-react";

const SocietyDetails = ({ society }) => {
  if (!society) return null;

  const { subscription } = society;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Building className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-100">{society.name}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            <MapPin className="w-4 h-4" />
            {society.city || "No City Specified"}
          </div>
        </div>
      </div>

      {/* SOCIETY INFO CARDS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-800/50 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
            <List className="w-4 h-4" />
            Total Wings
          </span>
          <span className="text-lg font-semibold text-gray-200">
            {society.wings?.length || 0}
          </span>
        </div>

        <div className="bg-dark-800/50 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
            <Calendar className="w-4 h-4" />
            Created On
          </span>
          <span className="text-lg font-semibold text-gray-200">
            {formatDate(society.createdAt)}
          </span>
        </div>
      </div>

      {/* SUBSCRIPTION SECTION */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          Subscription Details
        </h3>

        {subscription ? (
          <div className="bg-gradient-to-br from-dark-800 to-dark-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute -right-10 -top-10 w-40 h-40 blur-[80px] rounded-full opacity-20 pointer-events-none ${subscription.plan === 'yearly' ? 'bg-purple-500' : 'bg-emerald-500'}`} />

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 relative z-10">
              
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Plan Type</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-bold border bg-primary-500/10 text-primary-400 border-primary-500/20 capitalize">
                  {subscription.plan}
                </span>
              </div>

              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Status</span>
                {subscription.status === "active" ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-400">
                    <XCircle className="w-4 h-4" />
                    {subscription.status}
                  </span>
                )}
              </div>

              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Start Date</span>
                <span className="text-sm font-medium text-gray-200">{formatDate(subscription.startDate)}</span>
              </div>

              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Expiry Date</span>
                <span className="text-sm font-medium text-gray-200">{formatDate(subscription.endDate)}</span>
              </div>

              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Subscribed Flats</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-gray-200">
                  <Home className="w-4 h-4 text-gray-400" />
                  {subscription.allowedFlats} Units
                </span>
              </div>

              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Total Amount Paid</span>
                <span className="text-lg font-bold text-gray-100">₹{subscription.totalAmount?.toLocaleString() || 0}</span>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <XCircle className="w-10 h-10 text-red-400/80 mx-auto mb-3" />
            <p className="text-lg font-bold text-red-400">No Active Subscription</p>
            <p className="text-sm text-red-400/80 mt-1">This society currently does not have an active billing plan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocietyDetails;
