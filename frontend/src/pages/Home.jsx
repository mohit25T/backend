import React from "react";

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Apex IT World</h1>

        <div className="space-x-6 text-sm">
          <a href="#home" className="hover:text-indigo-600">
            Home
          </a>
          <a href="#app" className="hover:text-indigo-600">
            Our App
          </a>
          <a href="#contact" className="hover:text-indigo-600">
            Contact
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="text-center py-32 px-6 text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-green-400"
      >
        <h1 className="text-5xl font-bold mb-6">
          Smart Society Management App
        </h1>

        <p className="max-w-2xl mx-auto mb-10 opacity-90">
          Apex IT World provides a modern digital platform for apartments and
          gated communities to manage visitors, residents, complaints and
          maintenance in one powerful mobile application.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="https://m.apexitworld.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg shadow hover:scale-105 transition"
          >
            Request Demo
          </a>

          <a
            href="#contact"
            className="border border-white px-8 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* App Details */}
      <section id="app" className="py-24 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-14">
          What Our App Offers
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-3">Visitor Management</h3>

            <p className="text-gray-600 text-sm">
              Security guards can approve or reject visitors instantly and
              residents receive real-time notifications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-3">Complaint Management</h3>

            <p className="text-gray-600 text-sm">
              Residents can easily register complaints and track resolution
              status directly in the app.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-3">Resident Management</h3>

            <p className="text-gray-600 text-sm">
              Admins can manage owners, tenants and Gguard in one centralized
              system.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-3">Maintenance Tracking</h3>

            <p className="text-gray-600 text-sm">
              Track society maintenance payments and records digitally without
              manual paperwork.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-3">Smart Notifications</h3>

            <p className="text-gray-600 text-sm">
              Residents receive instant alerts for visitors, announcements and
              society notices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-3">Secure & Reliable</h3>

            <p className="text-gray-600 text-sm">
              Built with modern technology and secure infrastructure for smooth
              society management.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 text-center bg-gray-50 px-6">
        <h2 className="text-3xl font-bold mb-6">Contact Us</h2>

        <p className="text-gray-600 mb-10 max-w-xl mx-auto">
          Interested in using our Society Management App for your apartment or
          gated community? Get in touch with us today.
        </p>

        <div className="space-y-3 text-gray-700">
          <p>📧 Email: info@apexitworld.com</p>
          <p>📞 Phone: +91 9106807472</p>
          <p>📍 Gujarat, India</p>
        </div>
      </section>
    </div>
  );
}
