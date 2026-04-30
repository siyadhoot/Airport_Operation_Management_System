// src/app/belts/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, RefreshCw, Link2, Unlink } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useResourceStore, useFlightStore } from '@/store';
import { beltApi, flightApi } from '@/lib/api';
import { FlightDTO } from '@/types';
import toast from 'react-hot-toast';

const BELT_STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'badge-green', ACTIVE: 'badge-blue', MAINTENANCE: 'badge-red',
};

export default function BeltsPage() {
  const { belts, setBelts, updateBelt } = useResourceStore();
  const flights = useFlightStore((s) => s.flights);
  const [assignModal, setAssignModal] = useState<{ open: boolean; beltId?: number }>({ open: false });
  const [selFlight, setSelFlight] = useState<number | ''>('');

  const load = async () => {
    const [bRes, fRes] = await Promise.all([beltApi.getAll(), flightApi.getAll()]);
    setBelts(bRes.data);
    useFlightStore.getState().setFlights(fRes.data);
  };

  useEffect(() => { load(); }, []);

  const handleAssign = async () => {
    if (!assignModal.beltId || !selFlight) return;
    try {
      const res = await beltApi.assign(assignModal.beltId, selFlight as number);
      updateBelt(res.data);
      toast.success('Belt assigned!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Assign failed');
    } finally { setAssignModal({ open: false }); setSelFlight(''); }
  };

  const handleRelease = async (id: number) => {
    try {
      const res = await beltApi.release(id);
      updateBelt(res.data);
      toast.success('Belt released');
    } catch { toast.error('Release failed'); }
  };

  const handleCreate = async () => {
    const code = prompt('Belt code (e.g. BB-05):');
    const terminal = prompt('Terminal (e.g. T2):');
    if (!code || !terminal) return;
    try {
      const res = await beltApi.create({ beltCode: code, terminal });
      setBelts([...belts, res.data]);
      toast.success('Belt added!');
    } catch { toast.error('Create failed'); }
  };

  return (
    <AppShell adminOnly={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-primary-400" /> Baggage Belts
            </h1>
            <p className="text-slate-400 text-sm">
              {belts.filter((b) => b.status === 'AVAILABLE').length} of {belts.length} available
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={load} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Belt
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {belts.map((b, i) => (
            <motion.div key={b.id}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="card text-center hover:border-primary-700 transition-all"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-airport-card flex items-center justify-center">
                <Package className={`w-6 h-6 ${b.status === 'AVAILABLE' ? 'text-green-400' : b.status === 'ACTIVE' ? 'text-blue-400' : 'text-red-400'}`} />
              </div>
              <p className="font-bold text-white">{b.beltCode}</p>
              <p className="text-xs text-slate-400 mb-2">Terminal {b.terminal}</p>
              <span className={`${BELT_STATUS_COLORS[b.status] || 'badge-gray'} text-xs mb-3 block`}>
                {b.status}
              </span>
              {b.currentFlightNumber && (
                <p className="text-xs text-blue-400 mb-2">✈ {b.currentFlightNumber}</p>
              )}
              <div className="flex gap-1 mt-auto">
                {b.status === 'AVAILABLE' ? (
                  <button onClick={() => setAssignModal({ open: true, beltId: b.id })}
                    className="flex-1 py-1 text-xs bg-blue-900/30 text-blue-400 rounded border border-blue-800">
                    Assign
                  </button>
                ) : (
                  <button onClick={() => handleRelease(b.id)}
                    className="flex-1 py-1 text-xs bg-green-900/30 text-green-400 rounded border border-green-800">
                    Release
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {assignModal.open && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-airport-panel border border-airport-border rounded-2xl w-full max-w-sm p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Assign Belt to Flight</h3>
              <select value={selFlight} onChange={(e) => setSelFlight(e.target.value ? Number(e.target.value) : '')}
                className="input mb-4">
                <option value="">Select flight...</option>
                {flights.filter((f) => ['ARRIVED', 'BOARDING'].includes(f.status)).map((f) => (
                  <option key={f.id} value={f.id}>{f.flightNumber} — {f.origin}→{f.destination}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button onClick={() => setAssignModal({ open: false })} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleAssign} disabled={!selFlight} className="btn-primary flex-1">Assign</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
