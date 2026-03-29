import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowRight,
  ChevronRight,
  Activity,
  Zap,
  Vote,
  Baby,
  Car,
  ClipboardList,
  Contact2,
  Database,
  Smartphone,
  AlertTriangle,
  X,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

// Fallback for demonstration
const HeroMockup = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop";

export default function HomePage() {
  const [showFeatures, setShowFeatures] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const stats = [
    { label: "Societies", value: "50+", icon: Users },
    { label: "Residents", value: "10k+", icon: Users },
    { label: "Security Checks", value: "1M+", icon: ShieldCheck },
  ];

  const doorPassFeatures = [
    "Maintenance Management",
    "Vote pole",
    "Notice and Complains",
    "Visitor Management",
    "Feedback",
    "Permission Management",
    "Child Safety",
    "Vehicle management",
    "Resident & visitor Entry Records",
    "Security Guard Dashboard",
    "Society Management Tools",
    "Real-time Notifications",
    "Easy Mobile & Web Access",
    "Secure Data Management",
    "Analysis",
    "SOS",
    "Separate Personal app",
    "Helper Contacts",
  ];

  const handleWhatsAppInquiry = () => {
    const { firstName, lastName, email, message } = formData;
    const fullName = `${firstName} ${lastName}`.trim() || "Interested Client";
    const waNumber = "919106807472";
    const text = `Hello Apex IT World! %0A%0A*Name:* ${fullName}%0A*Email:* ${email || "Not specified"}%0A*Message:* ${message || "I'm interested in DoorPass!"}`;
    window.open(`https://wa.me/${waNumber}?text=${text}`, "_blank");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-dark-950 text-gray-100 min-h-screen relative overflow-x-hidden selection:bg-amber-500/30">
      
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600/5 blur-[150px] rounded-full z-0 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 blur-[150px] rounded-full z-0 pointer-events-none" />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold tracking-tighter"
          >
            <span className="text-amber-500">Apex</span> IT World
          </motion.h1>

          <div className="hidden md:flex items-center space-x-10 text-sm font-medium text-gray-400">
            <a href="#home" className="hover:text-white transition-colors relative group">Home</a>
            <button 
              onClick={() => setShowFeatures(true)}
              className="hover:text-white transition-colors relative group text-amber-500 font-bold"
            >
              System Features
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500" />
            </button>
            <a href="#contact" className="hover:text-white transition-colors relative group">Contact</a>
            <a href="/login" className="bg-white/5 border border-white/10 px-5 py-2 rounded-full hover:bg-white/10 transition">
              Login
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20">
        
        {/* HERO SECTION */}
        <section id="home" className="max-w-7xl mx-auto px-6 md:px-12 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full text-amber-500 text-xs font-bold uppercase tracking-widest mb-8">
              <Zap className="w-3 h-3 fill-current" />
              <span>Door Pass Security System</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold leading-[1.05] mb-8 tracking-tighter">
              DOOR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">PASS</span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-lg leading-relaxed">
              A modern software-based security and management platform 
              designed for apartments and residential societies. 
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-20">
              <button 
                onClick={() => setShowFeatures(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-xl shadow-amber-600/20 active:scale-95 flex items-center justify-center gap-2 group"
              >
                Explore All Features <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={handleWhatsAppInquiry} className="px-10 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold transition-all">
                Book App Demo
              </button>
            </div>

            <div className="flex gap-12 border-t border-white/5 pt-12">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-amber-500/60 uppercase tracking-widest font-black">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ... existing Hero Mockup section ... */}
        </section>

        {/* ... existing features and other sections ... */}

        {/* UPDATED CONTACT SECTION */}
        <section id="contact" className="max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-white/5">
          <div className="glass-panel rounded-[3.5rem] p-8 md:p-20 flex flex-col lg:flex-row gap-20">
            <div className="flex-1">
              <h2 className="text-5xl font-black mb-10 tracking-tighter">Get in touch.</h2>
              <div className="space-y-8">
                {[
                  { icon: Mail, label: "Email", val: "info@apexitworld.com" },
                  { icon: Phone, label: "Phone", val: "+91 9106807472" },
                  { icon: MapPin, label: "Address", val: "Gujarat, India" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all">
                      <item.icon className="w-6 h-6 text-gray-400 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] font-black text-white/30 mb-1">{item.label}</div>
                      <div className="text-xl text-white font-medium">{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-10 md:p-12">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <input name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" placeholder="First Name" className="glass-input !rounded-2xl" />
                  <input name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" placeholder="Last Name" className="glass-input !rounded-2xl" />
                </div>
                <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address" className="glass-input !rounded-2xl" />
                <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us about your society..." rows={4} className="glass-input !rounded-2xl resize-none" />
                <button 
                  onClick={handleWhatsAppInquiry}
                  className="bg-white text-dark-950 w-full py-5 rounded-2xl font-black text-lg hover:bg-amber-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-6 h-6" /> Send WhatsApp Inquiry
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FLOATING WHATSAPP BUTTON */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWhatsAppInquiry}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-amber-600/40 border border-amber-600/20 animate-pulse"
      >
        <MessageCircle className="w-8 h-8" />
      </motion.button>

      {/* ... existing footer and modal section ... */}
    </div>
  );
}