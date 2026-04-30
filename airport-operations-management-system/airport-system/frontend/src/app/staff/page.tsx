// src/app/staff/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Users, RefreshCw, Plane, Wrench, Star } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useStaffStore } from '@/store';
import { staffApi } from '@/lib/api';
import { StaffDTO, StaffType } from '@/types';
import toast from 'react-hot-toast';

const TYPE_ICONS: Record<StaffType, React.ElementType> = {
  Pilot: Plane, GroundStaff: Wrench, AirHostess: Star
};
const TYPE_COLORS: Record<StaffType, string> = {
  Pilot: 'text-blue-400 bg-blue-900/30', GroundStaff: 'text-amber-400 bg-amber-900/30',
  AirHostess: 'text-pink-400 bg-pink-900/30'
};
const STATUS_BADGES: Record<string, string> = {
  ACTIVE: 'badge-green', ON_LEAVE: 'badge-yellow', INACTIVE: 'badge-red'
};

function StaffModal({
  staff, onClose, onSaved
}: { staff?: StaffDTO; onClose: () => void; onSaved: (s: StaffDTO) => void }) {
  const [form, setForm] = useState<Partial<StaffDTO>>({
    dtype: staff?.dtype || 'Pilot',
    name: staff?.name || '',
    employeeId: staff?.employeeId || '',
    email: staff?.email || '',
    phone: staff?.phone || '',
    licenseNumber: staff?.licenseNumber || '',
    flightHours: staff?.flightHours || 0,
    areaAssigned: staff?.areaAssigned || '',
    languageSkills: staff?.languageSkills || '',
  });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof StaffDTO, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = staff
        ? await staffApi.update(staff.id, form)
        : await staffApi.create(form);
      toast.success(`Staff ${staff ? 'updated' : 'added'}!`);
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
        className="bg-airport-panel border border-airport-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-airport-border flex justify-between">
          <h2 className="text-lg font-semibold text-white">{staff ? 'Edit Staff' : 'Add Staff'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Staff Type</label>
              <select value={form.dtype} onChange={(e) => set('dtype', e.target.value)} className="input">
                {(['Pilot','GroundStaff','AirHostess'] as StaffType[]).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Employee ID</label>
              <input type="text" value={form.employeeId}
                onChange={(e) => set('employeeId', e.target.value)}
                className="input" placeholder="EMP-001" required
              />
            </div>
            <div className="col-span-2">
              <label className="label">Full Name</label>
              <input type="text" value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="input" required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="input" required
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="text" value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                className="input"
              />
            </div>
          </div>

          {form.dtype === 'Pilot' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">License Number</label>
                <input type="text" value={form.licenseNumber}
                  onChange={(e) => set('licenseNumber', e.target.value)}
                  className="input" placeholder="DGCA-PIL-001"
                />
              </div>
              <div>
                <label className="label">Flight Hours</label>
                <input type="number" min={0} value={form.flightHours}
                  onChange={(e) => set('flightHours', Number(e.target.value))}
                  className="input"
                />
              </div>
            </div>
          )}
          {form.dtype === 'GroundStaff' && (
            <div>
              <label className="label">Area Assigned</label>
              <input type="text" value={form.areaAssigned}
                onChange={(e) => set('areaAssigned', e.target.value)}
                className="input" placeholder="Terminal 1 / Baggage"
              />
            </div>
          )}
          {form.dtype === 'AirHostess' && (
            <div>
              <label className="label">Language Skills (comma-separated)</label>
              <input type="text" value={form.languageSkills}
                onChange={(e) => set('languageSkills', e.target.value)}
                className="input" placeholder="Hindi,English,French"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : staff ? 'Update' : 'Add Staff'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function StaffPage() {
  const { staff, setStaff, addStaff, updateStaff, removeStaff, loading, setLoading } = useStaffStore();
  const [modal, setModal] = useState<{ open: boolean; staff?: StaffDTO }>({ open: false });
  const [filter, setFilter] = useState<StaffType | ''>('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await staffApi.getAll();
      setStaff(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Remove staff member?')) return;
    try {
      await staffApi.delete(id);
      removeStaff(id);
      toast.success('Staff removed');
    } catch { toast.error('Delete failed'); }
  };

  const filtered = staff.filter((s) => !filter || s.dtype === filter);

  return (
    <AppShell adminOnly={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-primary-400" /> Manage Staff
            </h1>
            <p className="text-slate-400 text-sm">{staff.length} team members</p>
          </div>
          <div className="flex gap-3">
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)}
              className="input w-36">
              <option value="">All Types</option>
              {(['Pilot','GroundStaff','AirHostess'] as StaffType[]).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button onClick={load} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={() => setModal({ open: true })} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Staff
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => {
            const Icon = TYPE_ICONS[s.dtype as StaffType] || Users;
            const colorClass = TYPE_COLORS[s.dtype as StaffType] || 'text-slate-400 bg-slate-800';
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card hover:border-primary-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.employeeId}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setModal({ open: true, staff: s })}
                      className="p-1.5 text-slate-400 hover:text-blue-400 rounded">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(s.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-2">{s.email}</p>
                <div className="flex items-center justify-between">
                  <span className={STATUS_BADGES[s.status] || 'badge-gray'}>{s.status}</span>
                  <span className="text-xs text-slate-500 italic">{s.dtype}</span>
                </div>
                {s.dtype === 'Pilot' && s.flightHours !== undefined && (
                  <p className="text-xs text-slate-500 mt-1">✈ {s.flightHours} flight hours</p>
                )}
                {s.dtype === 'GroundStaff' && s.areaAssigned && (
                  <p className="text-xs text-slate-500 mt-1">📍 {s.areaAssigned}</p>
                )}
                {s.dtype === 'AirHostess' && s.languageSkills && (
                  <p className="text-xs text-slate-500 mt-1">🗣 {s.languageSkills}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {modal.open && (
          <StaffModal
            staff={modal.staff}
            onClose={() => setModal({ open: false })}
            onSaved={(s) => {
              if (modal.staff) updateStaff(s);
              else addStaff(s);
            }}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
