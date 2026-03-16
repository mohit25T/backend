import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, MessageSquare, Users, Settings, Bell, Lock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-dark-950 text-gray-100 min-h-screen relative overflow-hidden font-sans selection:bg-primary-500/30">
      
      {/* Global Mesh Background */}
      <div className="fixed inset-0 bg-mesh-dark bg-cover bg-center bg-no-repeat bg-fixed opacity-70 drop-shadow-2xl z-0 pointer-events-none" />
      
      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6 border-b border-white/5 bg-dark-900/50 backdrop-blur-xl">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-indigo-400 tracking-tight">
          Apex IT World
        </h1>

        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-400">
          <a href="#home" className="hover:text-primary-400 transition-colors">
            Home
          </a>
          <a href="#app" className="hover:text-primary-400 transition-colors">
            Features
          </a>
          <a href="#contact" className="hover:text-primary-400 transition-colors">
            Contact
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            Next Generation Society Management
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight text-white drop-shadow-sm">
            Smart Management for <br className="hidden md:block"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-primary-400 to-cyan-400">
              Modern Communities
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mb-12 text-lg md:text-xl text-gray-400 font-light leading-relaxed">
            Apex IT World provides a premium digital platform for apartments and
            gated communities. Manage visitors, residents, complaints, and
            maintenance effortlessly in one powerful ecosystem.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://m.apexitworld.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl font-bold tracking-wide transition-all transform hover:scale-105 active:scale-95 btn-primary text-base shadow-xl shadow-primary-500/20"
            >
              Request Live Demo
            </a>

            <a
              href="#contact"
              className="px-8 py-4 rounded-xl font-bold tracking-wide transition-all bg-dark-800/80 backdrop-blur-md border border-white/10 text-gray-200 hover:bg-dark-700 hover:border-white/20 text-base"
            >
              Contact Sales
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="app" className="relative z-10 py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 bg-dark-950/40">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-4">Core Platform Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to secure, manage, and modernize your residential workflows.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {[
            {
              icon: ShieldCheck, color: "emerald",
              title: "Visitor Management", desc: "Security guards can approve or reject visitors instantly. Residents receive rich, real-time push notifications."
            },
            {
              icon: MessageSquare, color: "indigo",
              title: "Complaint Resolution", desc: "Residents can easily register complaints and track resolution status transparently directly in the app."
            },
            {
              icon: Users, color: "blue",
              title: "Resident Directories", desc: "Administrators manage owners, tenants, and guards reliably in one centralized, secure dashboard system."
            },
            {
              icon: Settings, color: "purple",
              title: "Maintenance Tracking", desc: "Track society maintenance dues and financial collections digitally without manual paperwork or ledgers."
            },
            {
              icon: Bell, color: "amber",
              title: "Smart Broadcasts", desc: "Management broadcasts instant alerts for visitors, urgent announcements, and critical society notices automatically."
            },
            {
              icon: Lock, color: "cyan",
              title: "Enterprise Security", desc: "Built with cutting-edge architecture and robust infrastructure guaranteeing smooth, private society operations."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-light p-8 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:-rotate-12 duration-500 pointer-events-none">
                <feature.icon className={`w-32 h-32 text-${feature.color}-400`} />
              </div>

              <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-${feature.color}-500/10 border border-${feature.color}-500/20 shadow-lg shadow-${feature.color}-500/10`}>
                <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
              </div>

              <h3 className="text-xl font-bold text-gray-100 mb-3 relative z-10">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                {feature.desc}
              </p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-32 text-center border-t border-white/5 bg-black/40 backdrop-blur-3xl px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to upgrade your society?</h2>
          <p className="text-gray-400 mb-12 text-lg">
            Interested in deploying the Apex IT World ecosystem for your apartment or
            gated community? Get in touch with our specialists today.
          </p>

          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 inline-block text-left relative overflow-hidden">
            
            {/* Soft background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-500/5 blur-3xl z-0" />

            <div className="space-y-6 text-gray-300 text-lg relative z-10">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all">
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-primary-400" />
                </div>
                <p>info@apexitworld.com</p>
              </div>
              
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all">
                  <Phone className="w-5 h-5 text-gray-400 group-hover:text-primary-400" />
                </div>
                <p>+91 9106807472</p>
              </div>
              
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all">
                  <MapPin className="w-5 h-5 text-gray-400 group-hover:text-primary-400" />
                </div>
                <p>Gujarat, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-gray-500 text-sm border-t border-white/10 bg-dark-950 backdrop-blur-md">
        © {new Date().getFullYear()} Apex IT World. All rights reserved.
      </footer>
    </div>
  );
}
