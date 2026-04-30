'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';

const dummyNotifications = [
  { id: 1, type: 'CRITICAL', title: 'Severe Weather Warning', message: 'All flights delayed by 2 hours due to heavy rain and low visibility.', time: '10 mins ago' },
  { id: 2, type: 'WARNING', title: 'Gate Change', message: 'Flight AI-101 has been moved from Gate A4 to Gate B2.', time: '45 mins ago' },
  { id: 3, type: 'INFO', title: 'Staff Briefing', message: 'Mandatory staff briefing at 11:00 AM in the main briefing room.', time: '2 hours ago' },
  { id: 4, type: 'SUCCESS', title: 'System Update', message: 'The booking system update has been successfully applied.', time: 'Yesterday' },
];

export default function StaffNotificationsPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-airport-border pb-4">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Alerts & Notifications</h1>
              <p className="text-slate-400 text-sm">System broadcasts and updates</p>
            </div>
          </div>
          <button className="text-sm text-slate-400 hover:text-white transition-colors">
            Mark all as read
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {dummyNotifications.map((note, i) => {
              const Icon = note.type === 'CRITICAL' ? AlertTriangle :
                           note.type === 'WARNING' ? AlertTriangle :
                           note.type === 'SUCCESS' ? CheckCircle2 : Info;
              
              const colorClass = note.type === 'CRITICAL' ? 'text-red-400 bg-red-900/20 border-red-900/50' :
                                 note.type === 'WARNING' ? 'text-amber-400 bg-amber-900/20 border-amber-900/50' :
                                 note.type === 'SUCCESS' ? 'text-green-400 bg-green-900/20 border-green-900/50' :
                                 'text-blue-400 bg-blue-900/20 border-blue-900/50';

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-xl border ${colorClass} backdrop-blur-sm`}
                >
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-white">{note.title}</h3>
                        <span className="text-xs opacity-70">{note.time}</span>
                      </div>
                      <p className="text-sm text-slate-300">{note.message}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}
