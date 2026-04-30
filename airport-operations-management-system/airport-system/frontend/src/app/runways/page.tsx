// src/app/runways/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waypoints, Plus, RefreshCw, Link2, Unlink } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useResourceStore, useFlightStore } from '@/store';
import { runwayApi, flightApi } from '@/lib/api';
import { FlightDTO } from '@/types';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'badge-green', IN_USE: 'badge-yellow', MAINTENANCE: 'badge-red', CLOSED: 'badge-gray',
};

function AssignModal({ flights, onAssign, onClose }: {
  flights: FlightDTO[]; onAssign: (fId: number) => void; onClose: () => void;
}) {
  const [sel, setSel] = useState<number | ''>('');
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-airport-panel border border-airport-border rounded-2xl w-full max-w-sm p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Assign Runway to Flight</h3>
        <select value={sel} onChange={(e) => setSel(e.target.value ? Number(e.target.value) : '')}
          className="input mb-4">
          <option value="">Select flight...</option>
          {flights.filter((f) => ['SCHEDULED', 'BOARDING'].includes(f.status)).map((f) => (
            <option key={f.id} value={f.id}>{f.flightNumber} — {f.origin}→{f.destination}</option>
          ))}
        </select>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => sel && onAssign(sel as number)} disabled={!sel} className="btn-primary flex-1">
            Assign
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function RunwaysPage() {
  const { runways, setRunways, updateRunway } = useResourceStore();
  const flights = useFlightStore((s) => s.flights);
  const [assignModal, setAssignModal] = useState<{ open: boolean; runwayId?: number }>({ open: false });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [rRes, fRes] = await Promise.all([runwayApi.getAll(), flightApi.getAll()]);
      setRunways(rRes.data);
      useFlightStore.getState().setFlights(fRes.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAssign = async (flightId: number) => {
    if (!assignModal.runwayId) return;
    try {
      const res = await runwayApi.assign(assignModal.runwayId, flightId);
      updateRunway(res.data);
      toast.success('Runway assigned!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Assign failed');
    } finally { setAssignModal({ open: false }); }
  };

  const handleRelease = async (id: number) => {
    try {
      const res = await runwayApi.release(id);
      updateRunway(res.data);
      toast.success('Runway released');
    } catch { toast.error('Release failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete runway?')) return;
    try {
      await runwayApi.delete(id);
      setRunways(runways.filter((r) => r.id !== id));
      toast.success('Runway deleted');
    } catch { toast.error('Delete failed'); }
  };

  const handleCreate = async () => {
    const code = prompt('Runway code (e.g. RW-09R):');
    const lengthStr = prompt('Length in meters (e.g. 3600):');
    if (!code || !lengthStr) return;
    try {
      const res = await runwayApi.create({ runwayCode: code, lengthMeters: Number(lengthStr) });
      setRunways([...runways, res.data]);
      toast.success('Runway added!');
    } catch { toast.error('Create failed'); }
  };

  return (
    <AppShell adminOnly={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Waypoints className="w-6 h-6 text-primary-400" /> Manage Runways
            </h1>
            <p className="text-slate-400 text-sm">
              {runways.filter((r) => r.status === 'AVAILABLE').length} of {runways.length} available
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={load} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Runway
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {runways.map((r, i) => (
            <motion.div key={r.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card hover:border-primary-700 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xl font-bold text-white font-mono">{r.runwayCode}</p>
                  <p className="text-sm text-slate-400">{r.lengthMeters.toLocaleString()} m</p>
                </div>
                <span className={STATUS_COLORS[r.status] || 'badge-gray'}>{r.status}</span>
              </div>

              {r.currentFlightNumber && (
                <p className="text-xs text-blue-400 mb-2">✈ {r.currentFlightNumber}</p>
              )}

              {/* Visual runway strip */}
              <div className="w-full h-2 bg-airport-card rounded-full my-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    r.status === 'AVAILABLE' ? 'bg-green-500 w-full' :
                    r.status === 'IN_USE' ? 'bg-yellow-500 w-full' :
                    'bg-red-500 w-full'
                  }`}
                />
              </div>

              <div className="flex gap-2">
                {r.status === 'AVAILABLE' ? (
                  <button onClick={() => setAssignModal({ open: true, runwayId: r.id })}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs
                               bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 rounded-lg border border-blue-800">
                    <Link2 className="w-3 h-3" /> Assign
                  </button>
                ) : (
                  <button onClick={() => handleRelease(r.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs
                               bg-green-900/30 text-green-400 hover:bg-green-900/50 rounded-lg border border-green-800">
                    <Unlink className="w-3 h-3" /> Release
                  </button>
                )}
                <button onClick={() => handleDelete(r.id)}
                  className="px-3 py-1.5 text-xs bg-red-900/20 text-red-400
                             hover:bg-red-900/40 rounded-lg border border-red-900/40">✕</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {assignModal.open && (
          <AssignModal flights={flights} onAssign={handleAssign}
            onClose={() => setAssignModal({ open: false })} />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
