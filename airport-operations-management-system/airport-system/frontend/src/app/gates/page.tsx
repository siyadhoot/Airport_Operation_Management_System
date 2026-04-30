// src/app/gates/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DoorOpen, Plus, RefreshCw, Link2, Unlink } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useResourceStore, useFlightStore } from '@/store';
import { gateApi, flightApi } from '@/lib/api';
import { GateDTO, FlightDTO } from '@/types';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'badge-green', OCCUPIED: 'badge-yellow', MAINTENANCE: 'badge-red',
};

function ResourceCard({
  code, terminal, status, currentFlightNumber, onAssign, onRelease, onDelete
}: {
  code: string; terminal: string; status: string;
  currentFlightNumber?: string;
  onAssign: () => void; onRelease: () => void; onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card hover:border-primary-700 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-lg font-bold text-white">{code}</p>
          <p className="text-sm text-slate-400">Terminal {terminal}</p>
        </div>
        <span className={STATUS_COLORS[status] || 'badge-gray'}>{status}</span>
      </div>
      {currentFlightNumber && (
        <p className="text-xs text-blue-400 mb-3">✈ {currentFlightNumber}</p>
      )}
      <div className="flex gap-2 mt-2">
        {status === 'AVAILABLE' ? (
          <button onClick={onAssign}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs
                       bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 rounded-lg border border-blue-800">
            <Link2 className="w-3 h-3" /> Assign
          </button>
        ) : (
          <button onClick={onRelease}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs
                       bg-green-900/30 text-green-400 hover:bg-green-900/50 rounded-lg border border-green-800">
            <Unlink className="w-3 h-3" /> Release
          </button>
        )}
        <button onClick={onDelete}
          className="px-3 py-1.5 text-xs bg-red-900/20 text-red-400 hover:bg-red-900/40
                     rounded-lg border border-red-900/40">
          ✕
        </button>
      </div>
    </motion.div>
  );
}

// Flight assignment modal
function AssignFlightModal({
  flights, onAssign, onClose
}: { flights: FlightDTO[]; onAssign: (fId: number) => void; onClose: () => void }) {
  const [selectedFlight, setSelectedFlight] = useState<number | ''>('');
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-airport-panel border border-airport-border rounded-2xl w-full max-w-sm p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Assign to Flight</h3>
        <select value={selectedFlight}
          onChange={(e) => setSelectedFlight(e.target.value ? Number(e.target.value) : '')}
          className="input mb-4">
          <option value="">Select flight...</option>
          {flights.filter((f) => ['SCHEDULED','BOARDING'].includes(f.status)).map((f) => (
            <option key={f.id} value={f.id}>{f.flightNumber} — {f.origin}→{f.destination}</option>
          ))}
        </select>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={() => selectedFlight && onAssign(selectedFlight as number)}
            disabled={!selectedFlight}
            className="btn-primary flex-1"
          >
            Assign
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function GatesPage() {
  const { gates, setGates, updateGate } = useResourceStore();
  const flights = useFlightStore((s) => s.flights);
  const [assignModal, setAssignModal] = useState<{ open: boolean; gateId?: number }>({ open: false });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [gRes, fRes] = await Promise.all([gateApi.getAll(), flightApi.getAll()]);
      setGates(gRes.data);
      useFlightStore.getState().setFlights(fRes.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAssign = async (flightId: number) => {
    if (!assignModal.gateId) return;
    try {
      const res = await gateApi.assign(assignModal.gateId, flightId);
      updateGate(res.data);
      toast.success('Gate assigned!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Assign failed');
    } finally { setAssignModal({ open: false }); }
  };

  const handleRelease = async (id: number) => {
    try {
      const res = await gateApi.release(id);
      updateGate(res.data);
      toast.success('Gate released');
    } catch { toast.error('Release failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete gate?')) return;
    try {
      await gateApi.delete(id);
      setGates(gates.filter((g) => g.id !== id));
      toast.success('Gate deleted');
    } catch { toast.error('Delete failed'); }
  };

  const handleCreate = async () => {
    const code = prompt('Gate code (e.g. A4):');
    const terminal = prompt('Terminal (e.g. T1):');
    if (!code || !terminal) return;
    try {
      const res = await gateApi.create({ gateCode: code, terminal });
      setGates([...gates, res.data]);
      toast.success('Gate added!');
    } catch { toast.error('Create failed'); }
  };

  return (
    <AppShell adminOnly={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <DoorOpen className="w-6 h-6 text-primary-400" /> Manage Gates
            </h1>
            <p className="text-slate-400 text-sm">
              {gates.filter((g) => g.status === 'AVAILABLE').length} of {gates.length} available
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={load} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Gate
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {gates.map((g) => (
            <ResourceCard
              key={g.id}
              code={g.gateCode} terminal={g.terminal}
              status={g.status} currentFlightNumber={g.currentFlightNumber}
              onAssign={() => setAssignModal({ open: true, gateId: g.id })}
              onRelease={() => handleRelease(g.id)}
              onDelete={() => handleDelete(g.id)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {assignModal.open && (
          <AssignFlightModal
            flights={flights}
            onAssign={handleAssign}
            onClose={() => setAssignModal({ open: false })}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
