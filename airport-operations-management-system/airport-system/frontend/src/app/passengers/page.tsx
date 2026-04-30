// src/app/passengers/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Plus, Search, Edit2, Trash2, RefreshCw } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { passengerApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { PassengerDTO } from '@/types';
import toast from 'react-hot-toast';

function PassengerModal({ p, onClose, onSaved }: {
  p?: PassengerDTO; onClose: () => void; onSaved: (p: PassengerDTO) => void;
}) {
  const [form, setForm] = useState({
    name: p?.name || '', email: p?.email || '', phone: p?.phone || '',
    passportNumber: p?.passportNumber || '', nationality: p?.nationality || '',
  });
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = p ? await passengerApi.update(p.id, form) : await passengerApi.create(form);
      toast.success(`Passenger ${p ? 'updated' : 'added'}!`);
      onSaved(res.data);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-airport-panel border border-airport-border rounded-2xl w-full max-w-md">
        <div className="p-6 border-b border-airport-border flex justify-between">
          <h2 className="text-lg font-semibold text-white">{p ? 'Edit' : 'Add'} Passenger</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', required: true },
            { label: 'Email', key: 'email', type: 'email', required: true },
            { label: 'Phone', key: 'phone', type: 'tel', required: false },
            { label: 'Passport Number', key: 'passportNumber', type: 'text', required: false },
            { label: 'Nationality', key: 'nationality', type: 'text', required: false },
          ].map(({ label, key, type, required }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input type={type} value={(form as any)[key]}
                onChange={(e) => set(key, e.target.value)}
                className="input" required={required}
              />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : p ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function PassengersPage() {
  const [passengers, setPassengers] = useState<PassengerDTO[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; p?: PassengerDTO }>({ open: false });
  const [loading, setLoading] = useState(false);
  const { role } = useAuthStore();
  const isAdmin = role === 'ADMIN';

  const load = async () => {
    setLoading(true);
    try {
      const res = await passengerApi.getAll();
      setPassengers(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete passenger?')) return;
    try {
      await passengerApi.delete(id);
      setPassengers((prev) => prev.filter((p) => p.id !== id));
      toast.success('Passenger deleted');
    } catch { toast.error('Delete failed'); }
  };

  const filtered = passengers.filter((p) =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    (p.passportNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-primary-400" /> Passengers
            </h1>
            <p className="text-slate-400 text-sm">{passengers.length} registered</p>
          </div>
          <div className="flex gap-3">
            <button onClick={load} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            {isAdmin && (
              <button onClick={() => setModal({ open: true })} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Passenger
              </button>
            )}
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search name, email, passport..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-airport-card/50">
              <tr className="text-slate-400 text-left">
                {['ID', 'Name', 'Email', 'Phone', 'Passport', 'Nationality', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-airport-border">
              {filtered.map((p, i) => (
                <motion.tr key={p.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-airport-card/40 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">#{p.id}</td>
                  <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                  <td className="px-4 py-3 text-slate-300">{p.email}</td>
                  <td className="px-4 py-3 text-slate-400">{p.phone || '—'}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{p.passportNumber || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{p.nationality || '—'}</td>
                  <td className="px-4 py-3">
                    {isAdmin ? (
                      <div className="flex gap-2">
                        <button onClick={() => setModal({ open: true, p })}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 rounded">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic">View Only</span>
                    )}
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">No passengers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modal.open && (
          <PassengerModal p={modal.p} onClose={() => setModal({ open: false })}
            onSaved={(p) => {
              if (modal.p) setPassengers((prev) => prev.map((x) => x.id === p.id ? p : x));
              else setPassengers((prev) => [...prev, p]);
            }} />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
