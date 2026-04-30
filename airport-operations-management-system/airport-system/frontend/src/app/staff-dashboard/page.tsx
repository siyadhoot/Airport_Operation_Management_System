'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bell, Plane, Clock, ShieldCheck } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useAuthStore } from '@/store';
import Link from 'next/link';

export default function StaffDashboardPage() {
  const { username } = useAuthStore();

  return (
    <AppShell>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {username} 👋</h1>
          <p className="text-slate-400">Here is your schedule and operational overview for today.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/staff-schedule">
            <motion.div
              whileHover={{ y: -4 }}
              className="card bg-gradient-to-br from-blue-900/40 to-blue-800/10 border-blue-800/30 hover:border-blue-500/50 transition-all cursor-pointer h-full"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">My Schedule</h2>
              <p className="text-slate-400 text-sm">View your upcoming assigned flights and shift timings.</p>
            </motion.div>
          </Link>

          <Link href="/staff-status">
            <motion.div
              whileHover={{ y: -4 }}
              className="card bg-gradient-to-br from-purple-900/40 to-purple-800/10 border-purple-800/30 hover:border-purple-500/50 transition-all cursor-pointer h-full"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Plane className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Status Board</h2>
              <p className="text-slate-400 text-sm">Live read-only access to all terminal and gate assignments.</p>
            </motion.div>
          </Link>

          <Link href="/staff-notifications">
            <motion.div
              whileHover={{ y: -4 }}
              className="card bg-gradient-to-br from-amber-900/40 to-amber-800/10 border-amber-800/30 hover:border-amber-500/50 transition-all cursor-pointer h-full"
            >
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Alerts & Notifications</h2>
              <p className="text-slate-400 text-sm">Recent system alerts, delays, and important broadcast messages.</p>
            </motion.div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-400" /> Current Shift
            </h2>
            <div className="p-4 bg-airport-panel rounded-lg border border-airport-border flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Morning Shift</p>
                <p className="text-slate-400 text-sm">06:00 AM - 14:00 PM</p>
              </div>
              <span className="badge-green">Active</span>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary-400" /> Security Clearance
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Restricted Areas</span>
                <span className="text-white font-medium">Gates 1-12, Terminal A</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Clearance Level</span>
                <span className="text-blue-400 font-medium">Level 2 (Staff)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
