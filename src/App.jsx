import React, { useState, useEffect, useRef } from "react";
import { FiHome, FiFileText, FiSettings, FiUser, FiLogOut } from "react-icons/fi";
import { GiRadarSweep } from "react-icons/gi"
import { CgProfile } from "react-icons/cg";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import Dashboard from "./pages/Dashboard"
import Logs from "./pages/Logs"
import Settings from "./pages/Settings" 
import Users from "./pages/Users" 

const queryClient = new QueryClient();

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md border-r border-gray-200 transition-all duration-300 z-20 ${sidebarOpen ? 'w-64' : 'w-16'} ${isMobile ? 'fixed h-full' : ''}`}
        onMouseEnter={() => !isMobile && setSidebarOpen(true)}
        onMouseLeave={() => !isMobile && setSidebarOpen(false)}
      >
        <div className="p-4 font-bold text-xl text-blue-600 truncate transition-all duration-300">
          {sidebarOpen ? "SlothMQ" : "SM"}
        </div>
        <nav className="px-2 space-y-2">
          <Link to="/" className="group relative flex items-center py-2 px-2 text-gray-700 hover:text-blue-600 text-sm transition-all duration-300">
            <FiHome className={`text-lg transition-all duration-300 ${sidebarOpen ? '' : 'mx-auto'}`} />
            <span className={`ml-3 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Dashboard</span>
          </Link>
          <Link to="/logs" className="group relative flex items-center py-2 px-2 text-gray-700 hover:text-blue-600 text-sm transition-all duration-300">
            <FiFileText className={`text-lg transition-all duration-300 ${sidebarOpen ? '' : 'mx-auto'}`} />
            <span className={`ml-3 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Logs</span>
          </Link>
          <Link to="/settings" className="group relative flex items-center py-2 px-2 text-gray-700 hover:text-blue-600 text-sm transition-all duration-300">
            <FiSettings className={`text-lg transition-all duration-300 ${sidebarOpen ? '' : 'mx-auto'}`} />
            <span className={`ml-3 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Settings</span>
          </Link>
          <Link to="/metrics" className="group relative flex items-center py-2 px-2 text-gray-700 hover:text-blue-600 text-sm transition-all duration-300">
            <GiRadarSweep className={`text-lg transition-all duration-300 ${sidebarOpen ? '' : 'mx-auto'}`} />
            <span className={`ml-3 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Metrics</span>
          </Link>
          <Link to="/users" className="group relative flex items-center py-2 px-2 text-gray-700 hover:text-blue-600 text-sm transition-all duration-300">
            <FiUser className={`text-lg transition-all duration-300 ${sidebarOpen ? '' : 'mx-auto'}`} />
            <span className={`ml-3 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Users</span>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-auto">
        <header className="bg-white shadow-md border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {location.pathname === "/" ? "Dashboard" : location.pathname.replace("/", "")}
          </h1>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-800"
            >
              R
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-10 animate-fade-in">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                  <CgProfile /> Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
