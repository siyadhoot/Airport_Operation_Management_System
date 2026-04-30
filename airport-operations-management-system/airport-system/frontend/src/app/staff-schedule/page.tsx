'use client';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Plane } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';

const dummySchedule = [
  { id: 1, type: 'Flight Assignment', detail: 'AI-101 to DEL', time: '08:00 AM', duration: '2h 30m', location: 'Gate A4' },
  { id: 2, type: 'Briefing', detail: 'Crew Briefing Room', time: '11:00 AM', duration: '45m', location: 'Terminal 1, HQ' },
  { id: 3, type: 'Flight Assignment', detail: 'AI-204 to BLR', time: '13:00 PM', duration: '1h 45m', location: 'Gate B2' },
  { id: 4, type: 'End of Shift', detail: 'Sign out & debrief', time: '15:00 PM', duration: '30m', location: 'Staff Room' },
];

export default function StaffSchedulePage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 border-b border-airport-border pb-4">
          <Calendar className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">My Schedule</h1>
            <p className="text-slate-400 text-sm">Your assigned tasks for today</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-airport-border"></div>
          
          <div className="space-y-6">
            {dummySchedule.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-16 pr-4 py-2"
              >
                <div className="absolute left-5 w-3 h-3 bg-blue-500 rounded-full top-6 -translate-x-1.5 ring-4 ring-airport-dark"></div>
                
                <div className="card hover:border-blue-500/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">{item.type}</span>
                        <span className="text-slate-500 text-xs">•</span>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <Clock className="w-3 h-3" /> {item.duration}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{item.detail}</h3>
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <MapPin className="w-4 h-4 text-slate-500" /> {item.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{item.time}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
