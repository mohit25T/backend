import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  UserPlus,
  Building2,
  MailOpen,
  Users,
  Search,
  History,
  X,
  ShieldCheck
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/Dashboard", icon: LayoutDashboard },
  { name: "Add Admin", path: "/admins/add", icon: UserPlus },
  { name: "Societies", path: "/societies", icon: Building2 },
  { name: "Admin Invites", path: "/invites", icon: MailOpen },
  { name: "Users", path: "/users", icon: Users },
  { name: "Search", path: "/search", icon: Search },
  { name: "Audit Logs", path: "/audit-logs", icon: History },
];

const Sidebar = ({ open, setOpen }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-dark-950/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* SIDEBAR */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 z-50
                       w-72 min-h-screen
                       glass-panel flex flex-col border-y-0 border-l-0 border-r-white/10
                       rounded-r-2xl sm:rounded-none overflow-hidden"
          >
            {/* ✖ CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-5
                         w-8 h-8
                         flex items-center justify-center
                         text-gray-400 hover:text-white hover:bg-white/10
                         rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* BRANDING */}
            <div className="p-6 border-b border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
                Admin
              </div>
            </div>

            {/* NAVIGATION */}
            <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                          isActive
                            ? "bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/5"
                            : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : 'text-gray-500'}`} />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
