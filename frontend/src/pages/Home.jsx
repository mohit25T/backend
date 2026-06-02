import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import {
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
  Check,
  ChevronDown,
  Shield,
  RefreshCw,
  Layers,
  Award,
  Star,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Zap,
  Play,
  CheckCircle,
  Database,
  TrendingUp,
  Users,
  Factory,
  Settings,
  Briefcase,
  ShoppingCart,
  BarChart3,
  LineChart,
  FileText,
  CheckCircle2,
  Building,
  DollarSign,
  Calendar,
  ChevronRight,
  HelpCircle,
  Laptop,
  Truck,
  BookOpen,
  HeartPulse,
  HardHat,
  Scissors,
  Target
} from "lucide-react";

export default function HomePage() {
  // Preloader state
  const [isLoading, setIsLoading] = useState(true);
  
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  // Mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active tab in hero interactive mockup
  const [activeHeroTab, setActiveHeroTab] = useState("sales");

  // Active module in details modal/section
  const [selectedModule, setSelectedModule] = useState(null);

  // Dashboard Carousel active slide
  const [activeShowcaseSlide, setActiveShowcaseSlide] = useState(0);

  // Testimonials Carousel active slide
  const [activeTestimonialSlide, setActiveTestimonialSlide] = useState(0);

  // Pricing Cycle state
  const [isAnnualBilling, setIsAnnualBilling] = useState(false);

  // FAQs active states (indexes of open questions)
  const [openFaqIndexes, setOpenFaqIndexes] = useState([0]);

  // Video Tour modal
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Form submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact Form state
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    businessType: "Manufacturing",
    message: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Preloader Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Theme update effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Auto-slide effect for Testimonials
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveTestimonialSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  // Auto-slide effect for Showcase
  useEffect(() => {
    const showcaseTimer = setInterval(() => {
      setActiveShowcaseSlide((prev) => (prev + 1) % showcaseSlides.length);
    }, 8000);
    return () => clearInterval(showcaseTimer);
  }, []);

  // Handler for Contact form submit to send email notification
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.companyName.trim()) errors.companyName = "Company name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    if (!formData.message.trim()) errors.message = "Message is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      await api.post("/leads", {
        name: formData.name,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        businessType: formData.businessType,
        message: formData.message
      });
      setShowSuccessModal(true);
      setFormData({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        businessType: "Manufacturing",
        message: ""
      });
    } catch (apiError) {
      console.error("Failed to submit lead to backend:", apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // ERP stats trust indicators
  const stats = [
    { label: "Businesses Served", value: "100+", sub: "Across 8 sectors" },
    { label: "Uptime SLA", value: "99.9%", sub: "Enterprise grade" },
    { label: "Secure Architecture", value: "SSL / ISO", sub: "Fully encrypted" },
    { label: "Dedicated Support", value: "24/7", sub: "Under 15m response" }
  ];

  // ERP Features lists
  const features = [
    {
      title: "Inventory Management",
      icon: Database,
      desc: "Real-time stock valuation, serial tracking, automated reorder triggers, and multi-warehouse setups.",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Manufacturing Management",
      icon: Factory,
      desc: "Work orders, Bill of Materials (BOM), shop floor control, Routing, and waste tracking.",
      color: "from-indigo-500/20 to-blue-500/20"
    },
    {
      title: "Purchase Management",
      icon: ShoppingCart,
      desc: "Vendor portals, automated RFQs, purchase approvals, invoice matching, and history trackers.",
      color: "from-sky-500/20 to-indigo-500/20"
    },
    {
      title: "Sales Management",
      icon: TrendingUp,
      desc: "Quotation builders, pipeline analytics, order processing, delivery scheduling, and e-invoicing.",
      color: "from-cyan-500/20 to-blue-500/20"
    },
    {
      title: "HR & Payroll",
      icon: Users,
      desc: "Leave trackers, timesheet tracking, automated statutory payroll, and employee self-service.",
      color: "from-blue-500/20 to-indigo-500/20"
    },
    {
      title: "CRM Solutions",
      icon: MessageSquare,
      desc: "Lead scoring, conversation logs, customer support ticketing, and campaign managers.",
      color: "from-cyan-500/20 to-sky-500/20"
    },
    {
      title: "Finance & Accounting",
      icon: DollarSign,
      desc: "Ledgers, double-entry tracking, real-time trial balances, automated tax filing, and P&L charts.",
      color: "from-indigo-500/20 to-cyan-500/20"
    },
    {
      title: "Asset Management",
      icon: Settings,
      desc: "Depreciation schedules, maintenance logs, lifecycle tracking, and barcodes tag integration.",
      color: "from-blue-500/20 to-sky-500/20"
    },
    {
      title: "Production Planning",
      icon: Calendar,
      desc: "Master Production Scheduling (MPS), capacity calculation, and visual Gantt charts.",
      color: "from-sky-500/20 to-blue-500/20"
    },
    {
      title: "Reporting & Analytics",
      icon: BarChart3,
      desc: "Dozens of standard reports, custom KPI dashboards, scheduled exports, and PDF templates.",
      color: "from-cyan-500/20 to-indigo-500/20"
    }
  ];

  // ERP Modules data
  const modules = [
    {
      id: "sales",
      title: "Sales ERP",
      icon: BarChart3,
      desc: "Streamline quotation-to-cash workflows, track target progress, and automate tax calculations on every invoice.",
      bullets: ["Automated quotation generator", "Sales rep commission tables", "Customer invoice histories", "Integrated payment gateways"]
    },
    {
      id: "purchase",
      title: "Purchase ERP",
      icon: ShoppingCart,
      desc: "Centralize supplier contracts, track delivery tolerances, and match purchase orders to invoices automatically.",
      bullets: ["Supplier rating matrices", "Multi-currency order support", "Automated reorder triggers", "Bulk PO approval systems"]
    },
    {
      id: "inventory",
      title: "Inventory ERP",
      icon: Database,
      desc: "Control multi-site warehouses, execute barcode scanning, and balance stock ratios efficiently.",
      bullets: ["FIFO/LIFO/Average Costing", "Batch & serial number tracking", "Per-bin stock allocations", "Seamless stocktakes"]
    },
    {
      id: "manufacturing",
      title: "Manufacturing ERP",
      icon: Factory,
      desc: "Connect design to manufacture with multi-level Bills of Materials (BOM), routing tables, and live work center loads.",
      bullets: ["Visual Gantt schedules", "Scrap & yield calculations", "Work center capacity trackers", "Subcontracting modules"]
    },
    {
      id: "hr",
      title: "HR ERP",
      icon: Users,
      desc: "Digitize HR files, track leaves, automate statutory payroll structures, and evaluate appraisals.",
      bullets: ["Biometric device integrations", "Custom tax slab setups", "Employee self-service portals", "Training record databases"]
    },
    {
      id: "crm",
      title: "CRM ERP",
      icon: MessageSquare,
      desc: "Provide sales reps with client history cards, lead logging timelines, and follow-up calendars.",
      bullets: ["Interactive funnel stages", "Shared support ticket queues", "Email campaign statistics", "Automated meeting logs"]
    },
    {
      id: "accounting",
      title: "Accounting ERP",
      icon: DollarSign,
      desc: "Keep accounting teams up-to-date with bank feeds, automated reconciliations, and instant tax sheets.",
      bullets: ["Asset depreciation books", "Multi-branch consolidations", "Real-time balance sheets", "Tax compliance builders"]
    },
    {
      id: "project",
      title: "Project Management ERP",
      icon: Briefcase,
      desc: "Track billable project milestones, assign resource hours, and monitor budgeted profit margins.",
      bullets: ["Timesheet logging systems", "Milestone progress trackers", "Cost-to-complete metrics", "Task board views"]
    }
  ];

  // Industries list
  const industries = [
    { name: "Manufacturing", icon: Factory, desc: "BOM, inventory control, and visual floor plans.", color: "border-blue-500/20" },
    { name: "Bearing Industry", icon: Settings, desc: "Precision sizes trackers and serial tolerances.", color: "border-cyan-500/20" },
    { name: "Textile Industry", icon: Scissors, desc: "Dye-lot control, rolls tracking, and waste sheets.", color: "border-indigo-500/20" },
    { name: "Automotive", icon: Laptop, desc: "Part numbers, sub-assemblies, and quality reviews.", color: "border-sky-500/20" },
    { name: "Construction", icon: HardHat, desc: "Progress billing, subcontractor costs, and tasks.", color: "border-blue-500/20" },
    { name: "Healthcare", icon: HeartPulse, desc: "Medical supplies, inventory, and asset maintenance.", color: "border-cyan-500/20" },
    { name: "Retail", icon: ShoppingCart, desc: "Multi-channel POS, live inventory, and cards.", color: "border-indigo-500/20" },
    { name: "Distribution", icon: Truck, desc: "Pick-pack-ship, routes, and automated margins.", color: "border-sky-500/20" },
    { name: "Education", icon: BookOpen, desc: "Staff records, purchasing, inventory, and budgets.", color: "border-blue-500/20" },
    { name: "Logistics", icon: Truck, desc: "Fleet management, asset tracking, and job pricing.", color: "border-cyan-500/20" }
  ];

  // Why choose benefits
  const benefits = [
    { title: "Custom ERP Development", desc: "We customize workflows, database schemes, and reporting templates to match your company structure perfectly.", icon: Target },
    { title: "Cloud Based Solution", desc: "Access records from anywhere, securely. Backups are performed hourly, keeping data resilient.", icon: Database },
    { title: "Mobile Friendly", desc: "All responsive layouts operate seamlessly across smartphones, field tablets, and desktop setups.", icon: Laptop },
    { title: "Real-Time Reports", desc: "No more end-of-month surprises. Balance sheets, tax obligations, and sales pipelines update live.", icon: TrendingUp },
    { title: "Secure Architecture", desc: "Row-level permissions, TLS 1.3 encryption, and activity audits maintain top-level data security.", icon: Shield },
    { title: "Scalable Infrastructure", desc: "Easily grow from 10 to 1,000+ users. Add databases, sites, and server memory with zero service interruptions.", icon: RefreshCw },
    { title: "Dedicated Support Team", desc: "Dedicated implementation consultants and 24/7 technical support help your staff adapt.", icon: Users },
    { title: "Affordable Pricing", desc: "Flexible subscription rates that eliminate costly upfront server licenses or hidden overhead.", icon: DollarSign }
  ];

  // Carousel details for the dashboard showcase
  const showcaseSlides = [
    {
      title: "Sales Analytics Dashboard",
      desc: "Oversee team pipelines, contract valuations, and historical forecasts in real time.",
      metric: "$4.82M Annual Revenue",
      statColor: "text-blue-500",
      details: [
        { label: "Active Deals", val: "142" },
        { label: "Win Rate", val: "68%" },
        { label: "Avg. Cycle", val: "18 Days" }
      ],
      chartContent: (
        <div className="h-44 w-full flex items-end justify-between px-2 pt-6">
          {[40, 55, 48, 70, 85, 95, 110, 100, 120, 135, 125, 150].map((h, i) => (
            <div key={i} className="flex flex-col items-center w-1/12 group">
              <span className="opacity-0 group-hover:opacity-100 text-[10px] text-blue-500 font-bold mb-1 transition-opacity">
                ${h}k
              </span>
              <div 
                className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm transition-all duration-1000"
                style={{ height: `${h * 0.9}px` }}
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                {["J","F","M","A","M","J","J","A","S","O","N","D"][i]}
              </span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Real-Time Inventory Tracking",
      desc: "Automate reorder points, audit bins, and follow item movements dynamically.",
      metric: "42,850 Total Skus",
      statColor: "text-cyan-500",
      details: [
        { label: "Stock Value", val: "$1.2M" },
        { label: "Reorder Alerts", val: "3 Active" },
        { label: "Fulfillment", val: "99.4%" }
      ],
      chartContent: (
        <div className="h-44 w-full flex flex-col justify-center space-y-4 px-4">
          {[
            { label: "Raw Materials", percent: 65, color: "bg-blue-600", val: "27,850 units" },
            { label: "Work-In-Progress", percent: 20, color: "bg-cyan-500", val: "8,500 units" },
            { label: "Finished Goods", percent: 15, color: "bg-indigo-500", val: "6,500 units" }
          ].map((bar, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">{bar.label}</span>
                <span className="text-slate-500 dark:text-slate-400">{bar.val} ({bar.percent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Production Monitoring",
      desc: "Live OEE monitors, work center efficiency stats, and scheduler controls.",
      metric: "88.5% Plant Efficiency",
      statColor: "text-indigo-500",
      details: [
        { label: "Line 1 Status", val: "Running" },
        { label: "Scheduled BOM", val: "18 Orders" },
        { label: "Daily Target", val: "98.2%" }
      ],
      chartContent: (
        <div className="h-44 w-full flex items-center justify-around">
          {[
            { label: "Line 1", val: 92, color: "#2563eb", trail: "stroke-blue-500/10" },
            { label: "Line 2", val: 84, color: "#06b6d4", trail: "stroke-cyan-500/10" },
            { label: "Line 3", val: 89, color: "#6366f1", trail: "stroke-indigo-500/10" }
          ].map((gauge, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" strokeWidth="8" stroke="transparent" className={`${gauge.trail} fill-none`} />
                  <circle 
                    cx="50" cy="50" r="40" strokeWidth="8" stroke={gauge.color} 
                    strokeDasharray={`${2.51 * gauge.val} 251`} strokeLinecap="round" className="fill-none transition-all duration-1000" 
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-base font-bold text-slate-850 dark:text-slate-100">{gauge.val}%</span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">{gauge.label}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Employee Performance",
      desc: "Monitor attendance sheets, task progress charts, and resource timelines.",
      metric: "98.1% Resource Allocation",
      statColor: "text-sky-500",
      details: [
        { label: "Active Staff", val: "115" },
        { label: "Projects Completed", val: "26" },
        { label: "Absence Rate", val: "1.9%" }
      ],
      chartContent: (
        <div className="h-44 w-full overflow-y-auto custom-scrollbar space-y-2 p-2">
          {[
            { name: "Operations Team", tasks: 88, status: "completed" },
            { name: "Accounting Team", tasks: 95, status: "completed" },
            { name: "Procurement Group", tasks: 72, status: "progress" },
            { name: "Warehouse Assembly", tasks: 60, status: "progress" }
          ].map((team, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{team.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold">{team.tasks}% task rate</span>
                <span className={`w-2 h-2 rounded-full ${team.status === "completed" ? "bg-green-500" : "bg-amber-500"}`} />
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Revenue Reports & P&L",
      desc: "Export profit margins, cash flow matrices, and tax obligations.",
      metric: "24.5% Profit Margin",
      statColor: "text-emerald-500",
      details: [
        { label: "Cash Inflow", val: "$380k" },
        { label: "Expenses", val: "$286k" },
        { label: "Net Earnings", val: "+$94,000" }
      ],
      chartContent: (
        <div className="h-44 w-full flex items-center justify-center p-4">
          <div className="w-full flex items-end h-32 space-x-2">
            {[
              { month: "Jan", rev: 80, exp: 60 },
              { month: "Feb", rev: 95, exp: 65 },
              { month: "Mar", rev: 110, exp: 80 },
              { month: "Apr", rev: 130, exp: 90 },
              { month: "May", rev: 125, exp: 95 }
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end h-full">
                <div className="flex space-x-1 items-end h-full">
                  <div className="w-1/2 bg-blue-600 rounded-t-sm" style={{ height: `${d.rev * 0.7}%` }} />
                  <div className="w-1/2 bg-rose-500 rounded-t-sm" style={{ height: `${d.exp * 0.7}%` }} />
                </div>
                <span className="text-[10px] text-center text-slate-500 dark:text-slate-450 mt-1">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  // Testimonials list
  const testimonials = [
    {
      name: "Suresh Patel",
      company: "Apex Bearing Industries",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      review: "Integrating Apex IT World ERP saved us hundreds of work hours. Their inventory module updates our catalog in real-time, eliminating physical counts.",
      rating: 5
    },
    {
      name: "Meera Nair",
      company: "Vibrant Textiles Co.",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      review: "Our manufacturing yields improved by 18% in the first quarter of deployment. Tracking dye-lots and machine usage is now totally digital.",
      rating: 5
    },
    {
      name: "Rajesh Sharma",
      company: "R.S. Automotive Parts",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      review: "The custom development team at Apex IT World is unmatched. They adapted the purchase workflow to align exactly with our supply approvals matrix.",
      rating: 5
    }
  ];

  // FAQs list
  const faqs = [
    {
      q: "What is ERP?",
      a: "ERP stands for Enterprise Resource Planning. It is a suite of integrated software applications that businesses use to collect, store, manage, and interpret data from diverse business units (like finance, sales, inventory, HR, manufacturing, and customer service) in one unified database."
    },
    {
      q: "How long does implementation take?",
      a: "Typically, full deployment and staff onboarding take between 4 to 12 weeks, depending on the scale of custom development required, database imports, and the number of active modules you choose. We supply dedicated consultants to coordinate the transition."
    },
    {
      q: "Is cloud deployment available?",
      a: "Yes. Our ERP solutions are fully hosted on secure cloud infrastructure, guaranteeing a 99.9% uptime SLA. We perform encrypted hourly backups and manage OS patches so your internal IT staff doesn't have to."
    },
    {
      q: "Can the ERP be customized?",
      a: "Absolutely. One of our primary strengths is Custom ERP Development. We adapt database records, design custom PDF layouts, build tailor-made approval hierarchies, and sync with your third-party tools via REST APIs."
    },
    {
      q: "What support do you provide?",
      a: "We offer dedicated 24/7 technical support. Each customer is assigned an Implementation Manager during setup, followed by direct email, phone, and WhatsApp channels for rapid assistance under our 15-minute SLA."
    },
    {
      q: "Is data secure?",
      a: "We implement enterprise-grade security including TLS 1.3 encryption, standard SSL certificates, detailed database audit logs, row-level access permissions, and automated firewall checks."
    }
  ];

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 selection:bg-blue-500/20 dark:selection:bg-cyan-500/30 ${isDark ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      
      {/* 1. PROFESSIONAL LOADING SCREEN */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white"
          >
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Spinning Accent Gear/Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-cyan-500 border-l-transparent"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                className="absolute inset-2 rounded-full border-2 border-t-indigo-500 border-r-transparent border-b-sky-400 border-l-transparent opacity-60"
              />
              <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold tracking-tight mt-6"
            >
              <span className="text-blue-500">Apex</span> IT World
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.4 }}
              className="text-xs uppercase tracking-widest text-slate-400 mt-2"
            >
              Loading ERP Infrastructure...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Mesh Glows */}
      <div className="fixed top-[-10%] left-[-15%] w-[60%] h-[60%] bg-blue-600/10 dark:bg-blue-600/5 blur-[140px] rounded-full z-0 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-15%] w-[60%] h-[60%] bg-cyan-600/10 dark:bg-cyan-600/5 blur-[140px] rounded-full z-0 pointer-events-none" />

      {/* 2. STICKY NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <a href="#" className="flex items-center space-x-2 text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Apex</span>
            <span className="text-slate-800 dark:text-white font-medium">IT World</span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-650 dark:text-slate-350">
            <a href="#home" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Home</a>
            <a href="#features" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Features</a>
            <a href="#modules" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Modules</a>
            <a href="#industries" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Industries</a>
            <a href="#pricing" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Contact</a>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-650 dark:text-slate-350"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <a 
              href="#contact" 
              className="text-slate-700 dark:text-slate-300 font-semibold text-sm hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
            >
              Request Demo
            </a>
            <a 
              href="#pricing" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 transition-all"
            >
              Get Started
            </a>
          </div>

          {/* Hamburger / Menu buttons */}
          <div className="flex lg:hidden items-center space-x-3">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-700" />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 overflow-hidden"
            >
              <div className="flex flex-col space-y-4 px-6 py-8">
                {["Home", "Features", "Modules", "Industries", "Pricing", "FAQ", "Contact"].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-semibold text-slate-650 dark:text-slate-350 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 flex flex-col space-y-3">
                  <a 
                    href="#contact" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    Request Demo
                  </a>
                  <a 
                    href="#pricing" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-3 bg-blue-600 rounded-xl text-white font-semibold shadow-lg shadow-blue-600/20"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 pt-24">
        
        {/* 3. HERO SECTION */}
        <section id="home" className="max-w-7xl mx-auto px-6 md:px-12 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 px-4 py-2 rounded-full text-blue-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Next-Gen Cloud Enterprise ERP</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Transform Your Business With <br />
              <span className="text-gradient">Smart ERP Solutions</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed">
              Manage Sales, Inventory, Manufacturing, HR, Finance, CRM, and Operations from one powerful, scalable ERP platform tailored to your workflow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <a 
                href="#contact"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 group active:scale-95 text-center"
              >
                <span>Book Free Demo</span> 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button 
                onClick={() => setShowVideoModal(true)}
                className="px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current text-blue-600" />
                <span>Watch Product Tour</span>
              </button>
            </div>

            {/* TRUST INDICATORS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-200/60 dark:border-slate-800/40 pt-10">
              {stats.map((stat, i) => (
                <div key={i} className="text-left">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-[10px] uppercase font-extrabold tracking-widest text-blue-600 dark:text-cyan-400 mt-1">{stat.label}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* INTERACTIVE ERP DASHBOARD MOCKUP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* Soft decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 blur-[90px] rounded-full z-0" />
            
            <div className="relative glass-panel rounded-[2.5rem] overflow-hidden border border-slate-200/80 dark:border-slate-800/50 shadow-2xl z-10 bg-white dark:bg-slate-900/40">
              
              {/* Mock Window Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800/60 bg-slate-100/50 dark:bg-slate-950/40">
                <div className="flex space-x-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-500" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500" />
                </div>
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center space-x-1.5 bg-slate-200/50 dark:bg-slate-900 px-4 py-1 rounded-lg">
                  <Shield className="w-3 h-3 text-cyan-500" />
                  <span>apex-erp-cloud.com</span>
                </div>
                <div className="w-12 h-2" />
              </div>

              {/* Mock Dashboard Body */}
              <div className="p-6">
                {/* Mock Navigation Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 space-x-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: "sales", label: "Sales Pipeline", icon: TrendingUp },
                    { id: "stocks", label: "Realtime Stocks", icon: Database },
                    { id: "production", label: "Production Line", icon: Factory },
                    { id: "staff", label: "Employee HR", icon: Users }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveHeroTab(tab.id)}
                      className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                        activeHeroTab === tab.id
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Dynamic Content Panel */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeHeroTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeHeroTab === "sales" && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-slate-100/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/50">
                            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Quotations</span>
                            <div className="text-xl font-bold mt-1 text-slate-800 dark:text-white">$342.8k</div>
                            <span className="text-[9px] text-green-500 font-bold flex items-center mt-1">↑ 12% vs LW</span>
                          </div>
                          <div className="bg-slate-100/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/50">
                            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Invoiced</span>
                            <div className="text-xl font-bold mt-1 text-slate-800 dark:text-white">$218.4k</div>
                            <span className="text-[9px] text-green-500 font-bold flex items-center mt-1">↑ 8% vs LW</span>
                          </div>
                          <div className="bg-slate-100/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/50">
                            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Conversion</span>
                            <div className="text-xl font-bold mt-1 text-slate-800 dark:text-white">63.4%</div>
                            <span className="text-[9px] text-rose-500 font-bold flex items-center mt-1">↓ 1.2% vs LW</span>
                          </div>
                        </div>

                        {/* Interactive Graph Drawing */}
                        <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800/50">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Sales Performance (May)</span>
                            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 font-bold px-2 py-0.5 rounded">Live Syncing</span>
                          </div>
                          <div className="h-28 flex items-end justify-between px-1">
                            {[30, 45, 52, 40, 68, 79, 90, 85, 98, 110].map((val, i) => (
                              <div key={i} className="w-[8%] flex flex-col justify-end h-full">
                                <div 
                                  className="bg-blue-600 dark:bg-cyan-500 rounded-t-sm" 
                                  style={{ height: `${val}%` }}
                                />
                                <span className="text-[8px] text-slate-405 dark:text-slate-500 text-center mt-1">D{i+1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeHeroTab === "stocks" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl">
                          <div className="flex items-center space-x-2">
                            <Database className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Optimal Stock Level: 92%</span>
                          </div>
                          <span className="text-[10px] font-bold text-green-500">Auto-balanced</span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                          {[
                            { name: "6204 Bearing Assemblies", stock: "14,200", status: "In Stock", sColor: "text-green-500" },
                            { name: "Polyester Thread (Red Dye-Lot #4)", stock: "125 rolls", status: "Low Stock Alert", sColor: "text-rose-500" },
                            { name: "Aluminium Cast Alloy (AlSi9Cu3)", stock: "8.4 tons", status: "In Stock", sColor: "text-green-500" },
                            { name: "Grade A Carton Sheets (Flat)", stock: "2,500", status: "Reorder Triggered", sColor: "text-amber-500" }
                          ].map((item, idx) => (
                            <div key={idx} className="flex justify-between py-2.5 text-xs">
                              <div>
                                <div className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</div>
                                <div className={`text-[10px] mt-0.5 ${item.sColor}`}>{item.status}</div>
                              </div>
                              <div className="text-right font-mono font-bold text-slate-750 dark:text-slate-300">
                                {item.stock}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeHeroTab === "production" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-100/50 dark:bg-slate-905/40 border border-slate-200 dark:border-slate-800 rounded-xl">
                            <div className="text-xs text-slate-400 font-semibold">OEE (Overall Equipment Effectiveness)</div>
                            <div className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">91.4%</div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-full mt-2 overflow-hidden">
                              <div className="h-full bg-cyan-500 rounded-full" style={{ width: "91.4%" }} />
                            </div>
                          </div>
                          <div className="p-4 bg-slate-100/50 dark:bg-slate-905/40 border border-slate-200 dark:border-slate-800 rounded-xl">
                            <div className="text-xs text-slate-400 font-semibold">Scrap Rate</div>
                            <div className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">1.08%</div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-full mt-2 overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: "15%" }} />
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-100/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Active Work Order: WO-48201</div>
                            <div className="text-[10px] text-slate-400 mt-1">Target Quantity: 10,000 units | Completed: 6,400</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Line Active</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeHeroTab === "staff" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-450 uppercase font-black">Present Count</span>
                              <div className="text-xl font-bold text-slate-800 dark:text-white">92 / 95</div>
                            </div>
                            <Users className="w-8 h-8 text-blue-500/30" />
                          </div>
                          <div className="p-4 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-450 uppercase font-black">Payroll Status</span>
                              <div className="text-xl font-bold text-green-500">Disbursed</div>
                            </div>
                            <DollarSign className="w-8 h-8 text-green-500/30" />
                          </div>
                        </div>
                        <div className="p-3 bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-2">
                          <div className="font-bold text-slate-700 dark:text-slate-300">Upcoming Leave Approvals</div>
                          <div className="flex justify-between items-center text-[11px] text-slate-600 dark:text-slate-400">
                            <span>S. Kumar (Sales ERP) - 3 Days Personal</span>
                            <button className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[9px]">Approve</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mock Dashboard Bottom Status Bar */}
              <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 flex justify-between items-center text-[10px] text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-bold uppercase tracking-wider text-[9px]">Production Node Online</span>
                </div>
                <span>Server load: 12%</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. FEATURES GRID SECTION */}
        <section id="features" className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-200/60 dark:border-slate-800/40">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-cyan-400 mb-3">Enterprise Core Features</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Everything Needed to Scale Your Operations
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-4">
              Explore the robust core features engineered to connect disparate silos and synchronize your business workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-500/[0.02] border border-slate-200/80 dark:border-slate-800/40 bg-white dark:bg-slate-900/30 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-400 mb-6">
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-850 dark:text-white mb-3">{feat.title}</h4>
                  <p className="text-slate-500 dark:text-slate-405 text-sm leading-relaxed">{feat.desc}</p>
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full mt-6" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. ERP MODULES SHOWCASE */}
        <section id="modules" className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-200/60 dark:border-slate-800/40">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-cyan-400 mb-3">Enterprise ERP Modules</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Interactive Module Catalog
            </h3>
            <p className="text-slate-500 dark:text-slate-404 mt-4">
              Click "Learn More" on any module to review standard bullet features and functional descriptions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod) => (
              <div 
                key={mod.id}
                className="glass-card rounded-2xl p-6 bg-white dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-805/40 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-cyan-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-400 mb-4">
                    <mod.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-850 dark:text-white mb-2">{mod.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {mod.desc}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedModule(mod)}
                  className="w-full text-center py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-blue-600 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all"
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>

          {/* Module Detail Overlay Modal */}
          <AnimatePresence>
            {selectedModule && (
              <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedModule(null)}
                  className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                />
                
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl p-8 z-10 text-left"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                        <selectedModule.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-850 dark:text-white">{selectedModule.title}</h4>
                        <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-bold uppercase tracking-widest">Included module</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedModule(null)}
                      className="p-1 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {selectedModule.desc}
                  </p>

                  <h5 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Key Deliverables:</h5>
                  <ul className="space-y-2 mb-8">
                    {selectedModule.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedModule(null)}
                      className="flex-1 text-center py-3 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-bold rounded-xl transition-all"
                    >
                      Close Window
                    </button>
                    <a
                      href="#contact"
                      onClick={() => setSelectedModule(null)}
                      className="flex-1 text-center py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                    >
                      Request Demo
                    </a>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* 6. INDUSTRIES WE SERVE */}
        <section id="industries" className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-200/60 dark:border-slate-800/40">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-cyan-400 mb-3">Sectors We Service</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Tailored Layouts For Your Specific Industry
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-4">
              We deploy industry-specific modules configured directly for your business operations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {industries.map((ind, idx) => (
              <div 
                key={idx}
                className={`glass-card rounded-2xl p-6 bg-white dark:bg-slate-900/30 border ${ind.color} hover:scale-[1.03] transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 dark:bg-cyan-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-400 mb-4">
                    <ind.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-2">{ind.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-405 leading-relaxed">
                    {ind.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. WHY CHOOSE APEX ERP */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-200/60 dark:border-slate-800/40">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 text-left">
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-cyan-400 mb-3">Why Partner With Us</h2>
              <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                The Smart ERP Choice For High-Growth Enterprises
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed text-sm">
                From requirement mapping to custom modules and dedicated onboarding coordinators, we guarantee project success on time and on budget.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 max-w-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-xs font-bold text-green-700 dark:text-green-400">98% Implementation Success Rate</span>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 max-w-sm">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Certified secure cloud environment</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-850/40 flex items-start space-x-4 hover:shadow-lg transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-cyan-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0">
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-850 dark:text-white mb-2">{benefit.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. ERP DASHBOARD SHOWCASE CAROUSEL */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-200/60 dark:border-slate-800/40">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-cyan-400 mb-3">Live Reports Showcase</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Explore Our Live Dashboard Preview
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm">
              Use the control panel below to switch dashboard previews and review actual interface charts.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Left Carousel Navigation Panel */}
            <div className="lg:col-span-1 flex flex-col justify-center space-y-3">
              {showcaseSlides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveShowcaseSlide(idx)}
                  className={`text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    activeShowcaseSlide === idx
                      ? "bg-blue-600 dark:bg-slate-900/60 border-blue-600 dark:border-cyan-500/50 text-white shadow-xl shadow-blue-600/10"
                      : "bg-white dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/40"
                  }`}
                >
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-widest opacity-60">Preview Slide {idx+1}</div>
                    <div className="text-sm font-bold mt-1">{slide.title}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 shrink-0" />
                </button>
              ))}
            </div>

            {/* Right Showcase Live Preview Board */}
            <div className="lg:col-span-2 relative glass-panel rounded-[2rem] border border-slate-200/80 dark:border-slate-805/50 p-6 flex flex-col justify-between bg-white dark:bg-slate-900/35 overflow-hidden">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeShowcaseSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-bold text-slate-850 dark:text-white">{showcaseSlides[activeShowcaseSlide].title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                          {showcaseSlides[activeShowcaseSlide].desc}
                        </p>
                      </div>
                      <div className={`text-base font-extrabold ${showcaseSlides[activeShowcaseSlide].statColor} bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg`}>
                        {showcaseSlides[activeShowcaseSlide].metric}
                      </div>
                    </div>

                    {/* Chart Container */}
                    <div className="mt-8 bg-slate-50/50 dark:bg-slate-950/20 p-4 border border-slate-150 dark:border-slate-800/40 rounded-2xl">
                      {showcaseSlides[activeShowcaseSlide].chartContent}
                    </div>
                  </div>

                  {/* Micro stats indicators */}
                  <div className="grid grid-cols-3 gap-4 border-t border-slate-200/60 dark:border-slate-800/40 pt-6 mt-6">
                    {showcaseSlides[activeShowcaseSlide].details.map((det, index) => (
                      <div key={index} className="text-center md:text-left">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-widest">{det.label}</span>
                        <div className="text-sm font-bold mt-0.5 text-slate-800 dark:text-slate-250">{det.val}</div>
                      </div>
                    ))}
                  </div>

                </motion.div>
              </AnimatePresence>

              {/* Progress Bar indicator for active slide */}
              <div className="absolute top-0 inset-x-0 h-1 bg-slate-100 dark:bg-slate-800">
                <motion.div 
                  key={activeShowcaseSlide}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 8, ease: "linear" }}
                  className="h-full bg-blue-600 dark:bg-cyan-500" 
                />
              </div>
            </div>

          </div>
        </section>

        {/* 9. TESTIMONIALS SECTION */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-200/60 dark:border-slate-800/40 bg-slate-100/30 dark:bg-slate-950/20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-cyan-400 mb-3">Customer Success</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Trusted by Leading Industrialists
            </h3>
            <p className="text-slate-500 dark:text-slate-404 mt-4 text-sm">
              Read how Apex IT World ERP has helped companies digitize operations and achieve data accuracy.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonialSlide}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-[2.5rem] p-8 md:p-12 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 shadow-2xl relative"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img 
                    src={testimonials[activeTestimonialSlide].photo} 
                    alt={testimonials[activeTestimonialSlide].name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/20"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-850 dark:text-white">
                      {testimonials[activeTestimonialSlide].name}
                    </h4>
                    <span className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">
                      {testimonials[activeTestimonialSlide].company}
                    </span>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex space-x-1 mb-6 text-amber-400">
                  {[...Array(testimonials[activeTestimonialSlide].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-base md:text-lg text-slate-655 dark:text-slate-300 italic leading-relaxed">
                  "{testimonials[activeTestimonialSlide].review}"
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Testimonials dot selector navigation */}
            <div className="flex justify-center items-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonialSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    activeTestimonialSlide === index ? "w-8 bg-blue-600 dark:bg-cyan-500" : "w-2 bg-slate-300 dark:bg-slate-800"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 10. IMPLEMENTATION PROCESS SECTION */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-200/60 dark:border-slate-800/40">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-cyan-400 mb-3">Onboarding Roadmap</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Our ERP Implementation Process
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm">
              We guide your enterprise through a structured, risk-mitigated onboarding timeline.
            </p>
          </div>

          {/* Timeline Process Map */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical timeline divider line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12">
              {[
                { step: "01", title: "Requirement Analysis", desc: "Detailed workshops with key department heads to map database fields, document templates, approval channels, and integration specs." },
                { step: "02", title: "ERP Planning", desc: "Development of custom blueprints, database migration scopes, server allocations, and standard validation test protocols." },
                { step: "03", title: "Development", desc: "Configuration of database tables, layout updates, custom API integration, report template designs, and role configurations." },
                { step: "04", title: "Testing", desc: "Rigorous Sandbox testing, UAT dry-runs with representative user personas, load validation, and interface optimizations." },
                { step: "05", title: "Deployment", desc: "Final database cut-over, cloud server optimization, and official live deployment of ERP systems under TLS protocols." },
                { step: "06", title: "Training", desc: "Step-by-step documentation hand-offs, training webinars for administrators, and role-based staff onboarding tutorials." },
                { step: "07", title: "Support", desc: "Continuous SLA system checks, performance auditing, monthly updates, and 24/7 dedicated support team channels." }
              ].map((proc, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-stretch ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                  
                  {/* Left spacing or Card placement */}
                  <div className="flex-1 md:px-8 pb-4 md:pb-0">
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-850/40 relative shadow-sm hover:border-blue-500/20 dark:hover:border-cyan-500/20 transition-colors">
                      <div className="text-2xl font-black text-blue-600 dark:text-cyan-400 mb-2">{proc.step}</div>
                      <h4 className="text-base font-bold text-slate-850 dark:text-white mb-2">{proc.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {proc.desc}
                      </p>
                    </div>
                  </div>

                  {/* Bullet point on line */}
                  <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-cyan-500 border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center text-white shrink-0 self-center z-10 hidden md:flex" />

                  {/* Right Spacing panel */}
                  <div className="flex-1 hidden md:block" />

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. PRICING SECTION */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-200/60 dark:border-slate-800/40">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-cyan-400 mb-3">Flexible Billing</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Transparent, Value-Driven Subscriptions
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm">
              Select the pricing tier tailored to your active user base and modules complexity. Save 20% on annual commitments.
            </p>

            {/* Month/Year toggle */}
            <div className="flex items-center justify-center space-x-3 mt-8">
              <span className={`text-xs font-bold ${!isAnnualBilling ? "text-blue-600 dark:text-cyan-400" : "text-slate-400"}`}>Billed Monthly</span>
              <button 
                onClick={() => setIsAnnualBilling(!isAnnualBilling)}
                className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors duration-300 relative"
                aria-label="Toggle annual billing"
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-blue-600 dark:bg-cyan-500 transition-all duration-300 ${
                    isAnnualBilling ? "translate-x-6" : "translate-x-0"
                  }`} 
                />
              </button>
              <span className={`text-xs font-bold flex items-center space-x-1.5 ${isAnnualBilling ? "text-blue-600 dark:text-cyan-400" : "text-slate-400"}`}>
                <span>Billed Annually</span>
                <span className="text-[10px] bg-green-500/10 dark:bg-green-500/20 text-green-500 font-bold px-2 py-0.5 rounded-full">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="glass-card rounded-[2rem] p-8 bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-850/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Starter Plan</span>
                <h4 className="text-3xl font-bold text-slate-850 dark:text-white mt-4">
                  ${isAnnualBilling ? "39" : "49"}
                  <span className="text-xs text-slate-450 font-normal"> / user / month</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                  Best for growing local manufacturing plants and shops needing basic sales, inventory, and purchase modules.
                </p>
                <div className="h-px bg-slate-200 dark:bg-slate-800 my-6" />
                <ul className="space-y-3.5">
                  {["Up to 15 active users", "Sales & Purchase modules", "Standard Inventory ERP", "Real-Time basic reports", "Shared Cloud Hosting", "Email & Web Tickets Support"].map((feat, i) => (
                    <li key={i} className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-slate-355">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a 
                href="#contact"
                className="w-full text-center py-3 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs mt-8 transition-colors block"
              >
                Request Starter Demo
              </a>
            </div>

            {/* Business Plan (Recommended) */}
            <div className="glass-card rounded-[2rem] p-8 bg-white dark:bg-slate-900/35 border-2 border-blue-600 dark:border-cyan-500/50 flex flex-col justify-between relative shadow-xl shadow-blue-600/[0.03]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 text-[10px] uppercase font-black tracking-widest px-4 py-1 rounded-full">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">Business Plan</span>
                <h4 className="text-3xl font-bold text-slate-850 dark:text-white mt-4">
                  ${isAnnualBilling ? "119" : "149"}
                  <span className="text-xs text-slate-450 font-normal"> / user / month</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                  Best for multi-branch companies needing production controls, complete finance, asset monitoring, and CRM.
                </p>
                <div className="h-px bg-slate-200 dark:bg-slate-800 my-6" />
                <ul className="space-y-3.5">
                  {["Unlimited active users", "All 8 Core ERP modules", "Multi-warehouse allocations", "Advanced OEE & production plans", "Dedicated database instance", "24/7 Phone & WhatsApp Support", "1 Custom PDF Invoice layout"].map((feat, i) => (
                    <li key={i} className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-slate-355 font-medium">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a 
                href="#contact"
                className="w-full text-center py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs mt-8 transition-all shadow-lg shadow-blue-600/20 block"
              >
                Get Started Now
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="glass-card rounded-[2rem] p-8 bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-850/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enterprise</span>
                <h4 className="text-3xl font-bold text-slate-850 dark:text-white mt-4">
                  Custom
                  <span className="text-xs text-slate-450 font-normal"> / quotation</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                  Best for heavy manufacturing plants, multi-country holdings, or groups needing custom database architectures.
                </p>
                <div className="h-px bg-slate-200 dark:bg-slate-800 my-6" />
                <ul className="space-y-3.5">
                  {["Custom user volume scale", "Any number of custom modules", "API gateway access integrations", "On-premise deployment option", "Dedicated onboarding manager", "Custom backup retention policies", "Full SLA system guarantees"].map((feat, i) => (
                    <li key={i} className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-slate-355">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a 
                href="#contact"
                className="w-full text-center py-3 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs mt-8 transition-colors block"
              >
                Request Custom Quote
              </a>
            </div>
          </div>
        </section>

        {/* 12. FAQs SECTION (ACCORDION STYLE) */}
        <section id="faq" className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-200/60 dark:border-slate-800/40">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-cyan-400 mb-3">Have Questions?</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndexes.includes(index);
              return (
                <div 
                  key={index} 
                  className="rounded-2xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900/30 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100 pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* 13. LEAD GENERATION CONTACT FORM */}
        <section id="contact" className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-200/60 dark:border-slate-800/40">
          <div className="glass-panel rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row gap-16 bg-white dark:bg-slate-900/40 shadow-2xl relative overflow-hidden">
            
            {/* Grid Mesh lines in background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="flex-1 text-left relative z-10">
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-cyan-400 mb-3">Connect With Us</h2>
              <h3 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Ready to Optimize <br />Your Business?
              </h3>
              <p className="text-slate-550 dark:text-slate-400 mt-4 leading-relaxed text-sm">
                Submit an inquiry or request a custom-tailored product demo. An implementation expert will reach out within 15 minutes.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 flex items-center justify-center text-blue-650 dark:text-cyan-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-widest">Call Helpline</span>
                    <div className="text-base font-bold text-slate-800 dark:text-white">+91 9106807472</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 flex items-center justify-center text-blue-650 dark:text-cyan-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-widest">Support Email</span>
                    <div className="text-base font-bold text-slate-800 dark:text-white">info@apexitworld.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 flex items-center justify-center text-blue-650 dark:text-cyan-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-widest">Headquarters</span>
                    <div className="text-base font-bold text-slate-800 dark:text-white">Gujarat, India</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead generation fields form */}
            <div className="flex-1 relative z-10">
              <form onSubmit={handleContactSubmit} className="space-y-5 bg-slate-50 dark:bg-slate-900/60 p-6 md:p-10 border border-slate-200 dark:border-slate-800/80 rounded-2xl">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-[10px] uppercase font-bold text-slate-500">Contact Name</label>
                    <input 
                      id="name"
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      type="text" 
                      placeholder="e.g. Suresh Patel" 
                      className={`glass-input text-xs !py-3.5 ${formErrors.name ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
                    />
                    {formErrors.name && <p className="text-[10px] text-rose-500">{formErrors.name}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="companyName" className="text-[10px] uppercase font-bold text-slate-500">Company Name</label>
                    <input 
                      id="companyName"
                      name="companyName" 
                      value={formData.companyName} 
                      onChange={handleInputChange} 
                      type="text" 
                      placeholder="e.g. Apex Industries" 
                      className={`glass-input text-xs !py-3.5 ${formErrors.companyName ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
                    />
                    {formErrors.companyName && <p className="text-[10px] text-rose-500">{formErrors.companyName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-[10px] uppercase font-bold text-slate-500">Email Address</label>
                    <input 
                      id="email"
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      type="email" 
                      placeholder="suresh@company.com" 
                      className={`glass-input text-xs !py-3.5 ${formErrors.email ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
                    />
                    {formErrors.email && <p className="text-[10px] text-rose-500">{formErrors.email}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-[10px] uppercase font-bold text-slate-500">Phone Number</label>
                    <input 
                      id="phone"
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      type="text" 
                      placeholder="+91 98765 43210" 
                      className={`glass-input text-xs !py-3.5 ${formErrors.phone ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
                    />
                    {formErrors.phone && <p className="text-[10px] text-rose-500">{formErrors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="businessType" className="text-[10px] uppercase font-bold text-slate-500">Business Sector</label>
                  <select 
                    id="businessType"
                    name="businessType" 
                    value={formData.businessType} 
                    onChange={handleInputChange}
                    className="glass-input text-xs !py-3.5 dark:bg-slate-900"
                  >
                    <option value="Manufacturing">Manufacturing & Engineering</option>
                    <option value="Bearing">Bearing Manufacturing</option>
                    <option value="Textile">Textile & Dyeing</option>
                    <option value="Automotive">Automotive & Spares</option>
                    <option value="Construction">Construction & Projects</option>
                    <option value="Distribution">Wholesale & Logistics</option>
                    <option value="Retail">Retail & Service Sectors</option>
                    <option value="Other">Other sector</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-[10px] uppercase font-bold text-slate-500">Message / Inquiries</label>
                  <textarea 
                    id="message"
                    name="message" 
                    value={formData.message} 
                    onChange={handleInputChange} 
                    placeholder="Provide details on required custom modules, user count, or current ERP systems..." 
                    rows={3} 
                    className={`glass-input text-xs !py-3.5 resize-none ${formErrors.message ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
                  />
                  {formErrors.message && <p className="text-[10px] text-rose-500">{formErrors.message}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-500 text-white w-full py-4 rounded-xl font-bold text-sm transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/35 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Request Product Demo</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      {/* 14. FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
          
          {/* Col 1 Brand detail */}
          <div className="col-span-2 space-y-4">
            <a href="#" className="flex items-center space-x-2 text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Apex</span>
              <span className="text-slate-800 dark:text-white font-medium">IT World</span>
            </a>
            <p className="text-xs text-slate-550 dark:text-slate-400 max-w-sm leading-relaxed">
              We design and configure cloud-native ERP solutions optimized for manufacturing, logistics, and retail business sectors.
            </p>
            {/* Social Icons links */}
            <div className="flex space-x-3.5 pt-2">
              {/* WhatsApp */}
              <a 
                href="https://wa.me/919106807472" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-450 hover:bg-green-500 hover:text-white transition-all hover:scale-115"
                aria-label="WhatsApp support channel"
              >
                <Phone className="w-4 h-4" />
              </a>
              {/* Email */}
              <a 
                href="mailto:info@apexitworld.com" 
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-450 hover:bg-blue-600 hover:text-white transition-all hover:scale-115"
                aria-label="Contact Email address"
              >
                <Mail className="w-4 h-4" />
              </a>
              {/* Website */}
              <a 
                href="https://apexitworld.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-450 hover:bg-cyan-500 hover:text-white dark:hover:text-slate-950 transition-all hover:scale-115"
                aria-label="Apex IT World Portal"
              >
                <Laptop className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2 Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Quick Links</h4>
            <div className="flex flex-col space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <a href="#home" className="hover:text-blue-600 dark:hover:text-cyan-405 transition-colors">Home</a>
              <a href="#features" className="hover:text-blue-600 dark:hover:text-cyan-405 transition-colors">Features</a>
              <a href="#modules" className="hover:text-blue-600 dark:hover:text-cyan-405 transition-colors">Modules</a>
              <a href="#industries" className="hover:text-blue-600 dark:hover:text-cyan-405 transition-colors">Industries</a>
              <a href="#pricing" className="hover:text-blue-600 dark:hover:text-cyan-405 transition-colors">Pricing</a>
            </div>
          </div>

          {/* Col 3 ERP Modules */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400">ERP Modules</h4>
            <div className="flex flex-col space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <a href="#modules" className="hover:text-blue-600 dark:hover:text-cyan-405 transition-colors">Sales ERP</a>
              <a href="#modules" className="hover:text-blue-600 dark:hover:text-cyan-405 transition-colors">Purchase ERP</a>
              <a href="#modules" className="hover:text-blue-600 dark:hover:text-cyan-405 transition-colors">Inventory ERP</a>
              <a href="#modules" className="hover:text-blue-600 dark:hover:text-cyan-405 transition-colors">Manufacturing ERP</a>
              <a href="#modules" className="hover:text-blue-600 dark:hover:text-cyan-405 transition-colors">HR ERP</a>
            </div>
          </div>

          {/* Col 4 Contacts */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Contact Info</h4>
            <div className="flex flex-col space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span>+91 9106807472</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span>info@apexitworld.com</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span>Gujarat, India</span>
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-900 py-6 text-center text-[10px] text-slate-400 uppercase tracking-widest">
          <span>© 2026 Apex IT World. All Rights Reserved.</span>
        </div>
      </footer>

      {/* Floating Demo Inquiry Button (Conversion Optimiser) */}
      <a
        href="#contact"
        className="fixed bottom-6 right-6 z-40 bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold px-5 py-3 rounded-full flex items-center space-x-2 shadow-2xl hover:scale-105 active:scale-95 transition-all"
      >
        <MessageSquare className="w-4.5 h-4.5" />
        <span className="text-xs">Request Demo</span>
      </a>

      {/* WATCH PRODUCT TOUR GLASS MODAL */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVideoModal(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl z-10 p-6 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-base font-bold text-slate-800 dark:text-white">Apex ERP Interactive Platform Tour</h4>
                <button 
                  onClick={() => setShowVideoModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Dynamic Interactive Video/Mock Dashboard */}
              <div className="relative aspect-video rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-center p-6 border border-slate-850">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,0.15),transparent_70%)]" />
                <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4 animate-pulse">
                  <Play className="w-8 h-8 fill-current text-blue-500" />
                </div>
                <h5 className="text-base font-bold text-white relative z-10">Apex ERP Guided Tour Video Placeholder</h5>
                <p className="text-xs text-slate-400 max-w-sm mt-2 relative z-10">
                  This modal opens the high-conversion product tour video demonstrating manufacturing schedules and ledger integrations in real-time.
                </p>
                <button 
                  onClick={() => { setShowVideoModal(false); document.getElementById("contact").scrollIntoView({ behavior: "smooth" }); }}
                  className="mt-6 bg-white text-slate-950 text-xs font-extrabold px-6 py-2.5 rounded-xl hover:bg-blue-500 hover:text-white transition-all relative z-10"
                >
                  Book Live 1-on-1 Walkthrough
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL FOR DEMO INQUIRY */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl z-10 p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-bold text-slate-850 dark:text-white">Inquiry Sent Successfully!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed mt-3 max-w-sm mx-auto">
                Thank you. Your request details have been dispatched to our Gmail server. An email confirmation has been logged, and our team will get in touch with you shortly.
              </p>

              <button 
                onClick={() => setShowSuccessModal(false)}
                className="mt-8 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors text-xs font-bold"
              >
                Close and Go Back
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}