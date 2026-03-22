import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  MessageSquare,
  Users,
  Settings,
  Bell,
  MapPin,
  Phone,
  Mail,
  Lock,
} from "lucide-react";

export default function HomePage() {
  /* =========================
     ✅ TAILWIND SAFE COLORS
  ========================= */
  const colorClasses = {
    emerald: {
      icon: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      shadow: "shadow-emerald-500/10",
    },
    indigo: {
      icon: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      shadow: "shadow-indigo-500/10",
    },
    blue: {
      icon: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      shadow: "shadow-blue-500/10",
    },
    purple: {
      icon: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      shadow: "shadow-purple-500/10",
    },
    amber: {
      icon: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      shadow: "shadow-amber-500/10",
    },
    cyan: {
      icon: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      shadow: "shadow-cyan-500/10",
    },
  };

  /* =========================
     ✅ FEATURES (MEMOIZED)
  ========================= */
  const features = useMemo(
    () => [
      {
        icon: ShieldCheck,
        color: "emerald",
        title: "Visitor Management",
        desc: "Security guards can approve or reject visitors instantly. Residents receive real-time notifications.",
      },
      {
        icon: MessageSquare,
        color: "indigo",
        title: "Complaint Resolution",
        desc: "Residents can easily register complaints and track resolution status transparently.",
      },
      {
        icon: Users,
        color: "blue",
        title: "Resident Directories",
        desc: "Admins manage owners, tenants, and guards in one centralized dashboard.",
      },
      {
        icon: Settings,
        color: "purple",
        title: "Maintenance Tracking",
        desc: "Track maintenance dues and payments digitally without paperwork.",
      },
      {
        icon: Bell,
        color: "amber",
        title: "Smart Broadcasts",
        desc: "Send instant alerts, announcements, and notices to all residents.",
      },
      {
        icon: Lock,
        color: "cyan",
        title: "Enterprise Security",
        desc: "Secure infrastructure ensuring privacy and smooth operations.",
      },
    ],
    []
  );

  return (
    <div className="bg-dark-950 text-gray-100 min-h-screen relative overflow-hidden font-sans selection:bg-primary-500/30">
      
      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 bg-mesh-dark opacity-70 z-0 pointer-events-none" />
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 blur-[120px] rounded-full z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full z-0" />

      {/* ================= NAVBAR ================= */}
      <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6 border-b border-white/5 bg-dark-900/50 backdrop-blur-xl">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
          Apex IT World
        </h1>

        <div className="hidden md:flex space-x-8 text-sm text-gray-400">
          <a href="#home" className="hover:text-primary-400 transition">
            Home
          </a>
          <a href="#app" className="hover:text-primary-400 transition">
            Features
          </a>
          <a href="#contact" className="hover:text-primary-400 transition">
            Contact
          </a>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            Smart Management for <br />
            <span className="bg-gradient-to-r from-indigo-400 via-primary-400 to-cyan-400 bg-clip-text text-transparent">
              Modern Communities
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mb-12 text-lg text-gray-400">
            Manage visitors, residents, complaints, and maintenance in one powerful ecosystem.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://m.apexitworld.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl font-bold btn-primary shadow-xl shadow-primary-500/20"
            >
              Request Live Demo
            </a>

            <a
              href="#contact"
              className="px-8 py-4 rounded-xl border border-white/10 bg-dark-800 hover:bg-dark-700"
            >
              Contact Sales
            </a>
          </div>
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="app" className="relative z-10 py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-4">
            Core Platform Features
          </h2>
          <p className="text-gray-400">
            Everything you need to manage your society efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const styles = colorClasses[feature.color];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-light p-8 rounded-2xl border border-white/5 hover:border-white/10"
              >
                <div
                  className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center ${styles.bg} ${styles.border}`}
                >
                  <feature.icon className={`w-7 h-7 ${styles.icon}`} />
                </div>

                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section
        id="contact"
        className="relative z-10 py-32 text-center border-t border-white/5 px-6"
      >
        <h2 className="text-4xl font-bold text-white mb-6">
          Contact Us
        </h2>

        <div className="space-y-6 text-gray-300 text-lg">
          <div className="flex justify-center items-center gap-3">
            <Mail className="w-5 h-5" />
            info@apexitworld.com
          </div>

          <div className="flex justify-center items-center gap-3">
            <Phone className="w-5 h-5" />
            +91 9106807472
          </div>

          <div className="flex justify-center items-center gap-3">
            <MapPin className="w-5 h-5" />
            Gujarat, India
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 py-8 text-center text-gray-500 text-sm border-t border-white/10">
        © {new Date().getFullYear()} Apex IT World. All rights reserved.
      </footer>
    </div>
  );
}