// src/app/dashboard/page.tsx
'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Plane, Users, Ticket, Settings2, DoorOpen, Waypoints,
  Package, AlertTriangle, TrendingUp, Activity
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useDashboardStore, useFlightStore } from '@/store';
import { dashboardApi } from '@/lib/api';
import { FlightDTO } from '@/types';

// ---- Helpers ----
const statusColor = (status: string) => ({
  SCHEDULED: 'badge-blue',
  BOARDING: 'badge-green',
  DEPARTED: 'badge-green',
  ARRIVED: 'badge-gray',
  DELAYED: 'badge-yellow',
  CANCELLED: 'badge-red',
  EMERGENCY: 'badge-red',
}[status] || 'badge-gray');

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

// ---- Stat Card ----
function StatCard({
  icon: Icon, label, value, color = 'blue', delay = 0
}: {
  icon: React.ElementType; label: string; value: number | string; color?: string; delay?: number
}) {
  const colorMap: Record<string, string> = {
    blue:   'text-blue-400 bg-blue-900/30',
    green:  'text-green-400 bg-green-900/30',
    yellow: 'text-yellow-400 bg-yellow-900/30',
    red:    'text-red-400 bg-red-900/30',
    purple: 'text-purple-400 bg-purple-900/30',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data, loading, setData, setLoading } = useDashboardStore();
  const flights = useFlightStore((s) => s.flights);

  useEffect(() => {
    setLoading(true);
    dashboardApi.get().then((res) => {
      setData(res.data);
      useFlightStore.getState().setFlights(res.data.recentFlights);
    }).finally(() => setLoading(false));
  }, []);

  // Chart data from dashboard
  const flightStatusData = data ? [
    { name: 'Scheduled', value: data.scheduledFlights, color: '#3b82f6' },
    { name: 'Active',    value: data.activeFlights,    color: '#22c55e' },
    { name: 'Delayed',   value: data.delayedFlights,   color: '#f59e0b' },
  ] : [];

  const resourceData = data ? [
    { name: 'Gates',   available: data.availableGates },
    { name: 'Runways', available: data.availableRunways },
    { name: 'Belts',   available: data.availableBelts },
  ] : [];

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary-400" />
            Operations Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time airport operations overview</p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Plane}    label="Total Flights"   value={data?.totalFlights ?? 0}   color="blue"   delay={0.05} />
          <StatCard icon={AlertTriangle} label="Delayed"    value={data?.delayedFlights ?? 0} color="yellow" delay={0.10} />
          <StatCard icon={Users}    label="Passengers"      value={data?.totalPassengers ?? 0} color="green"  delay={0.15} />
          <StatCard icon={Ticket}   label="Bookings"        value={data?.totalBookings ?? 0}   color="purple" delay={0.20} />
          <StatCard icon={Settings2} label="Aircraft"       value={data?.totalAircraft ?? 0}   color="blue"   delay={0.25} />
          <StatCard icon={DoorOpen}  label="Available Gates" value={data?.availableGates ?? 0} color="green"  delay={0.30} />
          <StatCard icon={Waypoints} label="Avail. Runways"  value={data?.availableRunways ?? 0} color="blue" delay={0.35} />
          <StatCard icon={Package}   label="Avail. Belts"    value={data?.availableBelts ?? 0}  color="purple" delay={0.40} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flight status pie */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-400" />
              Flight Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={flightStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {flightStatusData.map((entry, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Resource availability bar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="card"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-400" />
              Resource Availability
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={resourceData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="available" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent flights table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Recent Flights</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-left border-b border-airport-border">
                  <th className="pb-3 font-medium">Flight</th>
                  <th className="pb-3 font-medium">Route</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Departure</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-airport-border">
                {data?.recentFlights.map((f) => (
                  <motion.tr
                    key={f.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-airport-card/50 transition-colors"
                  >
                    <td className="py-3 font-medium text-white">{f.flightNumber}</td>
                    <td className="py-3 text-slate-300">{f.origin} → {f.destination}</td>
                    <td className="py-3 text-slate-400 text-xs">{f.dtype.replace('Flight', '')}</td>
                    <td className="py-3 text-slate-300">
                      {new Date(f.departureTime).toLocaleString('en-IN', {
                        month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3">
                      <span className={statusColor(f.status)}>{f.status}</span>
                    </td>
                    <td className="py-3 text-slate-400">
                      {f.priority === 2147483647 ? '🚨 MAX' : f.priority}
                    </td>
                  </motion.tr>
                ))}
                {(!data?.recentFlights || data.recentFlights.length === 0) && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No flights found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
