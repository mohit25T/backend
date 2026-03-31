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

          {/* HERO MOCKUP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full" />
            <div className="relative glass-panel rounded-[3rem] overflow-hidden border-white/10 shadow-2xl">
              <img 
                src={HeroMockup} 
                alt="DoorPass Dashboard" 
                className="w-full h-auto object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center backdrop-blur-md">
                    <ShieldCheck className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">Security Level: High</div>
                    <div className="text-amber-500/60 text-xs font-black uppercase tracking-widest">Active Monitor</div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">System Online</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CORE FEATURES SHOWCASE */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bento-card border-amber-500/10 bg-gradient-to-br from-amber-500/[0.03] to-transparent">
              <div className="max-w-md">
                <h3 className="text-4xl font-bold mb-6 tracking-tighter">Everything your society needs.</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  From visitor management to society accounts, DoorPass provides a comprehensive ecosystem for modern residential living.
                </p>
                <button 
                  onClick={() => setShowFeatures(true)}
                  className="inline-flex items-center gap-3 text-amber-500 font-bold hover:gap-4 transition-all"
                >
                  View Full Catalog <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full" />
            </div>

            <div className="bento-card group hover:border-amber-500/20 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Smartphone className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3">Resident App</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Manage visitors, pay maintenance, and stay updated with your society - all from your smartphone.
                </p>
                <div className="flex gap-4">
                  <div className="h-1 w-12 bg-amber-500 rounded-full" />
                  <div className="h-1 w-4 bg-white/10 rounded-full" />
                  <div className="h-1 w-4 bg-white/10 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

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

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-2xl font-bold tracking-tighter">
          <span className="text-amber-500">Apex</span> IT World
        </div>
        <div className="flex items-center gap-10 text-xs font-black uppercase tracking-widest text-gray-500">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <span className="text-white/10">© 2026 apex it world</span>
        </div>
      </footer>

      {/* FEATURE CATALOG MODAL */}
      <AnimatePresence>
        {showFeatures && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="absolute inset-0 bg-dark-950/80 backdrop-blur-3xl"
              onClick={() => setShowFeatures(false)}
            />

            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative w-full max-w-6xl h-full max-h-[85vh] bg-white/[0.02] border border-white/10 shadow-2xl rounded-[3rem] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-8 md:p-12 border-b border-white/5 bg-white/[0.01]">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter mb-2">DoorPass <span className="text-amber-500">Ecosystem</span></h2>
                  <p className="text-gray-400 font-medium">Explore the full range of powerful security and management features.</p>
                </div>
                <button 
                  onClick={() => setShowFeatures(false)}
                  className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      title: "Security",
                      icon: ShieldCheck,
                      features: ["Visitor Management", "SOS Emergency", "Child Safety", "Vehicle Management", "Entry Records"]
                    },
                    {
                      title: "Management",
                      icon: Settings,
                      features: ["Maintenance Management", "Society Management", "Data Analytics", "Permission Control", "Staff Tracking"]
                    },
                    {
                      title: "Community",
                      icon: Users,
                      features: ["Vote Polling", "Feedback System", "Notice Bulletin", "Helper Contacts", "Resident Directory"]
                    },
                    {
                      title: "Digital",
                      icon: Smartphone,
                      features: ["Mobile & Web App", "Personal App", "Real-time Alerts", "Payment Gateway", "Multi-society Access"]
                    }
                  ].map((cat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                          <cat.icon className="w-5 h-5 text-amber-500" />
                        </div>
                        <h3 className="text-xs uppercase tracking-widest font-black text-amber-500/60">{cat.title}</h3>
                      </div>
                      <div className="space-y-4">
                        {cat.features.map((feat, j) => (
                          <div key={j} className="flex items-start gap-3 group">
                            <CheckCircle2 className="w-4 h-4 text-amber-500/30 group-hover:text-amber-500 transition-colors mt-0.5" />
                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-20 glass-panel rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-amber-500/20 bg-amber-500/5">
                  <div className="text-center md:text-left">
                    <h4 className="text-2xl font-bold mb-2">Need a private demo?</h4>
                    <p className="text-gray-400">Schedule a 1-on-1 walkthrough with our security experts.</p>
                  </div>
                  <button 
                    onClick={() => { setShowFeatures(false); handleWhatsAppInquiry(); }}
                    className="bg-amber-500 text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                  >
                    Request Demo Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}