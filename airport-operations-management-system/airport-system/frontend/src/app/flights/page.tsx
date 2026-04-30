// src/app/flights/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Plane, Edit2, Trash2, RefreshCw, Zap } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useFlightStore, useAuthStore } from '@/store';
import { flightApi, aircraftApi } from '@/lib/api';
import { FlightDTO, FlightCreateRequest, FlightType, AircraftDTO } from '@/types';
import toast from 'react-hot-toast';

const FLIGHT_TYPES: FlightType[] = ['DomesticFlight', 'InternationalFlight', 'CargoFlight', 'EmergencyFlight'];
const STATUSES = ['SCHEDULED','BOARDING','DEPARTED','ARRIVED','DELAYED','CANCELLED','EMERGENCY'];

const statusBadge = (s: string) => ({
  SCHEDULED:'badge-blue', BOARDING:'badge-green', DEPARTED:'badge-green',
  ARRIVED:'badge-gray', DELAYED:'badge-yellow', CANCELLED:'badge-red', EMERGENCY:'badge-red'
}[s] || 'badge-gray');

// ---- Flight Form Modal ----
function FlightModal({
  flight, aircraft, onClose, onSaved
}: {
  flight?: FlightDTO; aircraft: AircraftDTO[];
  onClose: () => void; onSaved: (f: FlightDTO) => void;
}) {
  const isEdit = !!flight;
  const [form, setForm] = useState<Partial<FlightCreateRequest>>({
    dtype: flight?.dtype || 'DomesticFlight',
    flightNumber: flight?.flightNumber || '',
    origin: flight?.origin || '',
    destination: flight?.destination || '',
    departureTime: flight?.departureTime ? flight.departureTime.slice(0, 16) : '',
    arrivalTime: flight?.arrivalTime ? flight.arrivalTime.slice(0, 16) : '',
    aircraftId: flight?.aircraftId,
    zone: flight?.zone || '',
    countryCode: flight?.countryCode || '',
    cargoWeightKg: flight?.cargoWeightKg,
    cargoType: flight?.cargoType || '',
    emergencyReason: flight?.emergencyReason || '',
    priorityLevel: flight?.priorityLevel || 10,
  });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof FlightCreateRequest, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form } as FlightCreateRequest;
      const res = isEdit
        ? await flightApi.update(flight!.id, payload)
        : await flightApi.create(payload);
      toast.success(`Flight ${isEdit ? 'updated' : 'created'}!`);
      onSaved(res.data);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error saving flight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-airport-panel border border-airport-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-airport-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? 'Edit Flight' : 'Add New Flight'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Flight Type */}
            <div>
              <label className="label">Flight Type</label>
              <select
                value={form.dtype} onChange={(e) => set('dtype', e.target.value)}
                className="input"
              >
                {FLIGHT_TYPES.map((t) => (
                  <option key={t} value={t}>{t.replace('Flight', '')}</option>
                ))}
              </select>
            </div>

            {/* Flight Number */}
            <div>
              <label className="label">Flight Number</label>
              <input
                type="text" value={form.flightNumber}
                onChange={(e) => set('flightNumber', e.target.value)}
                className="input" placeholder="AI-101" required
              />
            </div>

            {/* Origin */}
            <div>
              <label className="label">Origin</label>
              <input type="text" value={form.origin}
                onChange={(e) => set('origin', e.target.value)}
                className="input" placeholder="Mumbai (BOM)" required
              />
            </div>

            {/* Destination */}
            <div>
              <label className="label">Destination</label>
              <input type="text" value={form.destination}
                onChange={(e) => set('destination', e.target.value)}
                className="input" placeholder="Delhi (DEL)" required
              />
            </div>

            {/* Departure */}
            <div>
              <label className="label">Departure Time</label>
              <input type="datetime-local" value={form.departureTime}
                onChange={(e) => set('departureTime', e.target.value)}
                className="input" required
              />
            </div>

            {/* Arrival */}
            <div>
              <label className="label">Arrival Time</label>
              <input type="datetime-local" value={form.arrivalTime}
                onChange={(e) => set('arrivalTime', e.target.value)}
                className="input" required
              />
            </div>

            {/* Aircraft */}
            <div>
              <label className="label">Aircraft</label>
              <select
                value={form.aircraftId || ''}
                onChange={(e) => set('aircraftId', e.target.value ? Number(e.target.value) : undefined)}
                className="input"
              >
                <option value="">— None —</option>
                {aircraft.map((a) => (
                  <option key={a.id} value={a.id}>{a.registrationNumber} ({a.model})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subtype-specific fields */}
          {form.dtype === 'DomesticFlight' && (
            <div>
              <label className="label">Zone</label>
              <input type="text" value={form.zone} onChange={(e) => set('zone', e.target.value)}
                className="input" placeholder="North / South / East / West"
              />
            </div>
          )}
          {form.dtype === 'InternationalFlight' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Country Code</label>
                <input type="text" value={form.countryCode}
                  onChange={(e) => set('countryCode', e.target.value)}
                  className="input" placeholder="AE"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" checked={form.customsRequired}
                  onChange={(e) => set('customsRequired', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-300">Customs Required</span>
              </div>
            </div>
          )}
          {form.dtype === 'CargoFlight' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Cargo Weight (kg)</label>
                <input type="number" value={form.cargoWeightKg || ''}
                  onChange={(e) => set('cargoWeightKg', Number(e.target.value))}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Cargo Type</label>
                <input type="text" value={form.cargoType}
                  onChange={(e) => set('cargoType', e.target.value)}
                  className="input" placeholder="Perishables / Medical"
                />
              </div>
            </div>
          )}
          {form.dtype === 'EmergencyFlight' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Emergency Reason</label>
                <input type="text" value={form.emergencyReason}
                  onChange={(e) => set('emergencyReason', e.target.value)}
                  className="input" placeholder="Medical / Technical / Security"
                />
              </div>
              <div>
                <label className="label">Priority Level (1-10)</label>
                <input type="number" min={1} max={10} value={form.priorityLevel}
                  onChange={(e) => set('priorityLevel', Number(e.target.value))}
                  className="input"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : isEdit ? 'Update Flight' : 'Create Flight'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ---- Main Page ----
export default function FlightsPage() {
  const { flights, setFlights, updateFlight, removeFlight, addFlight, loading, setLoading } =
    useFlightStore();
  const { role } = useAuthStore();
  const isAdmin = role === 'ADMIN';
  const [aircraft, setAircraft] = useState<AircraftDTO[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState<{ open: boolean; flight?: FlightDTO }>({ open: false });

  const load = async () => {
    setLoading(true);
    try {
      const [flRes, acRes] = await Promise.all([flightApi.getAll(), aircraftApi.getAll()]);
      setFlights(flRes.data);
      setAircraft(acRes.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this flight?')) return;
    try {
      await flightApi.delete(id);
      removeFlight(id);
      toast.success('Flight deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleStatusChange = async (id: number, value: string) => {
    try {
      const res = await flightApi.updateStatus(id, value);
      updateFlight(res.data);
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = flights.filter((f) => {
    const matchSearch = !search ||
      f.flightNumber.toLowerCase().includes(search.toLowerCase()) ||
      f.origin.toLowerCase().includes(search.toLowerCase()) ||
      f.destination.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || f.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Plane className="w-6 h-6 text-primary-400" />
              Manage Flights
            </h1>
            <p className="text-slate-400 text-sm mt-1">{flights.length} total flights</p>
          </div>
          <div className="flex gap-3">
            <button onClick={load} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            {isAdmin && (
              <button onClick={() => setModal({ open: true })} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Flight
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by flight no, origin, destination..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="input w-44">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-airport-card/50">
                <tr className="text-slate-400 text-left">
                  {['Flight No.','Route','Type','Aircraft','Departure','Arrival','Status','Priority','Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-airport-border">
                <AnimatePresence>
                  {filtered.map((f) => (
                    <motion.tr
                      key={f.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-airport-card/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                        {f.status === 'EMERGENCY' && <Zap className="w-3 h-3 text-red-400" />}
                        {f.flightNumber}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{f.origin} → {f.destination}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{f.dtype.replace('Flight', '')}</td>
                      <td className="px-4 py-3 text-slate-400">{f.aircraftRegistration || '—'}</td>
                      <td className="px-4 py-3 text-slate-300">
                        {new Date(f.departureTime).toLocaleString('en-IN', {
                          month: 'short', day: '2-digit',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {new Date(f.arrivalTime).toLocaleString('en-IN', {
                          month: 'short', day: '2-digit',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {isAdmin ? (
                          <>
                            <select
                              value={f.status}
                              onChange={(e) => handleStatusChange(f.id, e.target.value)}
                              className="bg-transparent border-0 text-xs font-semibold cursor-pointer
                                         focus:outline-none text-inherit"
                            >
                              {STATUSES.map((s) => (
                                <option key={s} value={s} className="bg-airport-panel">{s}</option>
                              ))}
                            </select>
                            <span className={`ml-1 ${statusBadge(f.status)}`}>{f.status}</span>
                          </>
                        ) : (
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadge(f.status)}`}>{f.status}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                        {f.priority === 2147483647 ? '🚨 MAX' : f.priority}
                      </td>
                      <td className="px-4 py-3">
                        {isAdmin ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setModal({ open: true, flight: f })}
                              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(f.id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">View Only</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-slate-500">
                      No flights found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal.open && (
          <FlightModal
            flight={modal.flight}
            aircraft={aircraft}
            onClose={() => setModal({ open: false })}
            onSaved={(f) => {
              if (modal.flight) updateFlight(f);
              else addFlight(f);
            }}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
