import { motion } from "framer-motion";

const MetricCard = ({ title, value, icon: Icon, color = "text-primary-500", bgColor = "bg-primary-500/10" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="glass-panel rounded-2xl p-6 flex items-center justify-between group overflow-hidden relative"
    >
      {/* Background glow effect on hover */}
      <div className={`absolute -inset-4 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 ${bgColor}`} />
      
      <div className="relative z-10">
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h2 className="text-3xl font-bold text-gray-100 tracking-tight">{value}</h2>
      </div>

      {Icon && (
        <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${bgColor} ${color} group-hover:bg-opacity-20`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
