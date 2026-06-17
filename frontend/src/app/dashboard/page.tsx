"use client";

import { motion } from "framer-motion";
import { Activity, Users, Box, TrendingUp, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] font-sans text-white">
      {/* Top Border Highlight */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50"></div>

      {/* Header */}
      <header className="w-full border-b border-white/10 bg-[var(--secondary)]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] border border-white/20 shadow-[0_0_10px_rgba(109,40,217,0.2)]">
            <Activity className="text-white w-5 h-5" strokeWidth={2} />
          </div>
          <h1 className="text-sm font-semibold tracking-wide">
            IG-Inventory <span className="text-[var(--accent)]">Pro</span>
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-xs font-medium text-white/60">admin@injaazh.com</div>
          <button onClick={handleLogout} className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1.5 group">
            <span className="hidden sm:inline">Logout</span>
            <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold tracking-tight mb-1 text-white">Overview</h2>
          <p className="text-white/60 text-sm">Your enterprise metrics at a glance.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Total Products", value: "12,345", icon: Box, color: "text-[var(--accent)]" },
            { title: "Total Customers", value: "100,000+", icon: Users, color: "text-green-400" },
            { title: "Monthly Revenue", value: "৳ 1B+", icon: TrendingUp, color: "text-[var(--primary)]" },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 rounded-xl bg-[var(--secondary)]/50 border border-white/10 flex items-center justify-between hover:border-[var(--primary)]/50 hover:bg-[var(--secondary)] transition-all group cursor-pointer shadow-lg"
            >
              <div>
                <div className="text-white/60 text-xs font-medium mb-1">{stat.title}</div>
                <div className="text-xl font-semibold tracking-tight text-white">{stat.value}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/20 border border-white/5 group-hover:bg-white/5 transition-colors">
                <stat.icon className={`w-4 h-4 ${stat.color} transition-colors`} />
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
