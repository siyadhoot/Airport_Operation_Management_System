// src/app/aircraft/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Settings2, RefreshCw } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useAircraftStore } from '@/store';
import { aircraftApi } from '@/lib/api';
import { AircraftDTO } from '@/types';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'badge-green', IN_SERVICE: 'badge-blue',
  MAINTENANCE: 'badge-yellow', GROUNDED: 'badge-red',
};

function AircraftModal({
  aircraft, onClose, onSaved
}: { aircraft?: AircraftDTO; onClose: () => void; onSaved: (a: AircraftDTO) => void }) {
  const [form, setForm] = useState({
    registrationNumber: aircraft?.registrationNumber || '',
    model: aircraft?.model || '',
    manufacturer: aircraft?.manufacturer || '',
    capacity: aircraft?.capacity || 100,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = aircraft
        ? await aircraftApi.update(aircraft.id, form)
        : await aircraftApi.create(form);
      toast.success(`Aircraft ${aircraft ? 'updated' : 'added'}!`);
      onSaved(res.data);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-airport-panel border border-airport-border rounded-2xl w-full max-w-md"
      >
        <div className="p-6 border-b border-airport-border flex justify-between">
          <h2 className="text-lg font-semibold text-white">
            {aircraft ? 'Edit Aircraft' : 'Add Aircraft'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { label: 'Registration No.', key: 'registrationNumber', placeholder: 'VT-AEP' },
            { label: 'Model', key: 'model', placeholder: 'Boeing 737-800' },
            { label: 'Manufacturer', key: 'manufacturer', placeholder: 'Boeing' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input
                type="text"
                value={(form as any)[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="input" placeholder={placeholder}
                required={key !== 'manufacturer'}
              />
            </div>
          ))}
          <div>
            <label className="label">Capacity</label>
            <input
              type="number" min={1}
              value={form.capacity}
              onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))}
              className="input"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : aircraft ? 'Update' : 'Add Aircraft'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AircraftPage() {
  const { aircraft, setAircraft, addAircraft, updateAircraft, removeAircraft, loading, setLoading } =
    useAircraftStore();
  const [modal, setModal] = useState<{ open: boolean; aircraft?: AircraftDTO }>({ open: false });

  const load = async () => {
    setLoading(true);
    try {
      const res = await aircraftApi.getAll();
      setAircraft(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete aircraft?')) return;
    try {
      await aircraftApi.delete(id);
      removeAircraft(id);
      toast.success('Aircraft removed');
    } catch { toast.error('Delete failed'); }
  };

  const handleStatusChange = async (id: number, value: string) => {
    try {
      const res = await aircraftApi.updateStatus(id, value);
      updateAircraft(res.data);
    } catch { toast.error('Status update failed'); }
  };

  return (
    <AppShell adminOnly={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Settings2 className="w-6 h-6 text-primary-400" /> Manage Aircraft
            </h1>
            <p className="text-slate-400 text-sm">{aircraft.length} aircraft registered</p>
          </div>
          <div className="flex gap-3">
            <button onClick={load} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={() => setModal({ open: true })} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Aircraft
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aircraft.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card hover:border-primary-600 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-white">{a.registrationNumber}</p>
                  <p className="text-sm text-slate-400">{a.model}</p>
                  <p className="text-xs text-slate-500">{a.manufacturer}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setModal({ open: true, aircraft: a })}
                    className="p-1.5 text-slate-400 hover:text-blue-400 rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-slate-400">
                  Capacity: <span className="text-white font-medium">{a.capacity}</span>
                </span>
                <select
                  value={a.status}
                  onChange={(e) => handleStatusChange(a.id, e.target.value)}
                  className="bg-airport-card text-xs text-slate-300 border border-airport-border
                             rounded px-2 py-1 focus:outline-none"
                >
                  {['AVAILABLE','IN_SERVICE','MAINTENANCE','GROUNDED'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="mt-2">
                <span className={STATUS_COLORS[a.status] || 'badge-gray'}>{a.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modal.open && (
          <AircraftModal
            aircraft={modal.aircraft}
            onClose={() => setModal({ open: false })}
            onSaved={(a) => {
              if (modal.aircraft) updateAircraft(a);
              else addAircraft(a);
            }}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
