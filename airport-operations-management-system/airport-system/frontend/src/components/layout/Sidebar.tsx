// src/components/layout/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Plane, Settings2, Users, DoorOpen,
  Waypoints, Package, Ticket, UserCircle, LogOut, Zap
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const adminNavItems = [
  { href: '/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/flights',     label: 'Flights',       icon: Plane },
  { href: '/aircraft',    label: 'Aircraft',      icon: Settings2 },
  { href: '/staff',       label: 'Staff',         icon: Users },
  { href: '/gates',       label: 'Gates',         icon: DoorOpen },
  { href: '/runways',     label: 'Runways',       icon: Waypoints },
  { href: '/belts',       label: 'Baggage Belts', icon: Package },
  { href: '/passengers',  label: 'Passengers',    icon: UserCircle },
  { href: '/bookings',    label: 'Bookings',      icon: Ticket },
];

const staffNavItems = [
  { href: '/staff-dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/flights',         label: 'Flights',       icon: Plane },
  { href: '/staff-schedule',  label: 'My Schedule',   icon: Users },
  { href: '/staff-status',    label: 'Status Board',  icon: Plane },
  { href: '/passengers',      label: 'Passengers',    icon: UserCircle },
  { href: '/bookings',        label: 'Bookings',      icon: Ticket },
  { href: '/staff-notifications', label: 'Alerts',    icon: Zap },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { username, role, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed left-0 top-0 h-screen w-64 bg-airport-panel border-r border-airport-border
                 flex flex-col z-40 shadow-2xl"
    >
      {/* Logo */}
      <div className="p-6 border-b border-airport-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Airport OMS</p>
            <p className="text-xs text-slate-400">Operations Centre</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
          Navigation
        </p>
        {(role === 'ADMIN' ? adminNavItems : staffNavItems).map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-airport-card'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Live indicator */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 
                        border border-green-800/40 rounded-lg px-3 py-2">
          <Zap className="w-3 h-3 animate-pulse" />
          <span>Live flight feed active</span>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-t border-airport-border">
        <div className="flex items-center gap-3 mb-3">
          <div className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
            role === 'ADMIN' ? "bg-red-500 text-white" : "bg-blue-500 text-white"
          )}>
            {username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{username}</p>
            <p className={clsx(
              "text-xs font-semibold",
              role === 'ADMIN' ? "text-red-400" : "text-blue-400"
            )}>{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400
                     hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </motion.aside>
  );
}
