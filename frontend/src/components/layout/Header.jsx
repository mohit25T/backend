import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Menu, LogOut, MailCheck, ShieldAlert } from "lucide-react";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // 🔐 Read token directly
  const token = localStorage.getItem("token");

  // ✅ Determine super admin from JWT
  let isSuperAdmin = false;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      isSuperAdmin = decoded.role === "SUPER_ADMIN";
    } catch (e) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.header
      animate={{
        opacity: isSidebarOpen ? 0.6 : 1,
        y: isSidebarOpen ? -4 : 0,
      }}
      transition={{ duration: 0.25 }}
      className="h-16 lg:h-20 glass-panel border-x-0 border-t-0 border-b-white/5 shadow-glass-light
                 flex items-center justify-between
                 px-4 lg:px-8 sticky top-0 z-40 rounded-none w-full backdrop-blur-2xl"
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors group"
        >
          <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 hidden sm:block">
          Admin Console
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/change-email")}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border border-white/10
                     bg-white/5 text-sm font-medium text-gray-200
                     hover:bg-white/10 hover:text-white transition-all shadow-lg hover:shadow-white/5"
          title="Change Email"
        >
          <MailCheck className="w-4 h-4" />
          <span className="hidden sm:inline">Change Email</span>
        </button>

        {isSuperAdmin && (
          <button
            onClick={() => navigate("/super-admin/update")}
            className="flex items-center gap-2 bg-primary-600/90 text-white
                       px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border border-primary-500/50
                       hover:bg-primary-500 hover:scale-[1.02] hover:shadow-primary-500/25 transition-all shadow-lg text-sm font-medium"
            title="Update Super Admin"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden sm:inline">Update Super Admin</span>
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 text-red-500
                     px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border border-red-500/20
                     hover:bg-red-500 hover:text-white hover:scale-[1.02] transition-all shadow-lg text-sm font-medium"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
