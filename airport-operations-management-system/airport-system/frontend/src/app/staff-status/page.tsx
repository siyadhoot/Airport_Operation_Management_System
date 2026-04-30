'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, ArrowRight, Zap } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useFlightStore } from '@/store';
import { flightApi } from '@/lib/api';

export default function StaffStatusBoardPage() {
  const { flights, setFlights, loading, setLoading } = useFlightStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setLoading(true);
    flightApi.getAll().then((res) => {
      setFlights(res.data);
    }).finally(() => setLoading(false));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeFlights = flights.filter(f => !['ARRIVED', 'CANCELLED'].includes(f.status));

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-black p-6 rounded-2xl border border-airport-border">
          <div className="flex items-center gap-4">
            <Plane className="w-10 h-10 text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold text-yellow-400 tracking-wider uppercase">Departures & Arrivals</h1>
              <p className="text-yellow-400/70 text-sm tracking-widest uppercase mt-1">Live Status Board</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-mono font-bold text-yellow-400 tracking-wider">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </p>
            <p className="text-yellow-400/70 text-sm uppercase tracking-widest mt-1">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="bg-black rounded-2xl border border-airport-border overflow-hidden p-2">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="text-yellow-400/60 uppercase text-xs tracking-widest border-b border-yellow-400/20">
                <th className="py-4 px-6">Flight</th>
                <th className="py-4 px-6">Destination/Origin</th>
                <th className="py-4 px-6">Time</th>
                <th className="py-4 px-6">Gate</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yellow-400/10">
              <AnimatePresence>
                {activeFlights.map((f, i) => (
                  <motion.tr
                    key={f.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-yellow-400/5 transition-colors group"
                  >
                    <td className="py-4 px-6 text-xl font-bold text-white flex items-center gap-3">
                      {f.status === 'EMERGENCY' && <Zap className="w-5 h-5 text-red-500 animate-pulse" />}
                      {f.flightNumber}
                    </td>
                    <td className="py-4 px-6 text-xl text-yellow-400/90">
                      {f.origin} <ArrowRight className="inline w-4 h-4 text-yellow-400/50 mx-1" /> {f.destination}
                    </td>
                    <td className="py-4 px-6 text-xl text-yellow-100">
                      {new Date(f.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </td>
                    <td className="py-4 px-6 text-xl font-bold text-orange-400">
                      A{Math.floor(Math.random() * 20) + 1}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded border tracking-wider text-sm font-bold uppercase
                        ${f.status === 'DELAYED' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 animate-pulse' : 
                          f.status === 'BOARDING' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 
                          f.status === 'EMERGENCY' ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'}`}
                      >
                        {f.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {activeFlights.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-yellow-400/50 uppercase tracking-widest">
                    No Active Flights
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
