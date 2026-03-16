import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-950 bg-mesh-dark relative overflow-hidden transition-colors duration-500">
      {/* Ambient static glows for layout depth */}
      <div className="fixed top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[40rem] h-[40rem] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Sidebar (controlled) */}
      <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />

      {/* Main Layout */}
      <div className="flex flex-col min-h-screen relative z-0 relative z-10">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
