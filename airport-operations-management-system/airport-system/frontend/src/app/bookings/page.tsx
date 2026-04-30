// src/app/bookings/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Plus, Search, Trash2, RefreshCw } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { bookingApi, passengerApi, flightApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { BookingDTO, PassengerDTO, FlightDTO } from '@/types';
import toast from 'react-hot-toast';

const STATUS_BADGES: Record<string, string> = {
  CONFIRMED: 'badge-green', CANCELLED: 'badge-red',
  CHECKED_IN: 'badge-blue', BOARDED: 'badge-gray',
};

function BookingModal({ passengers, flights, onClose, onSaved }: {
  passengers: PassengerDTO[]; flights: FlightDTO[];
  onClose: () => void; onSaved: (b: BookingDTO) => void;
}) {
  const [form, setForm] = useState({ passengerId: '', flightId: '', seatNumber: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.passengerId || !form.flightId) {
      toast.error('Select passenger and flight'); return;
    }
    setLoading(true);
    try {
      const res = await bookingApi.create({
        passengerId: Number(form.passengerId),
        flightId: Number(form.flightId),
        seatNumber: form.seatNumber || undefined,
      });
      toast.success('Booking created!');
      onSaved(res.data);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Booking failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-airport-panel border border-airport-border rounded-2xl w-full max-w-md">
        <div className="p-6 border-b border-airport-border flex justify-between">
          <h2 className="text-lg font-semibold text-white">New Booking</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Passenger</label>
            <select value={form.passengerId}
              onChange={(e) => setForm((f) => ({ ...f, passengerId: e.target.value }))}
              className="input" required>
              <option value="">Select passenger...</option>
              {passengers.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.email}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Flight</label>
            <select value={form.flightId}
              onChange={(e) => setForm((f) => ({ ...f, flightId: e.target.value }))}
              className="input" required>
              <option value="">Select flight...</option>
              {flights.filter((f) => ['SCHEDULED','BOARDING'].includes(f.status)).map((f) => (
                <option key={f.id} value={f.id}>
                  {f.flightNumber} — {f.origin}→{f.destination} ({new Date(f.departureTime).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Seat Number (optional)</label>
            <input type="text" value={form.seatNumber}
              onChange={(e) => setForm((f) => ({ ...f, seatNumber: e.target.value }))}
              className="input" placeholder="14A"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Booking...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [passengers, setPassengers] = useState<PassengerDTO[]>([]);
  const [flights, setFlights] = useState<FlightDTO[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { role } = useAuthStore();
  const isAdmin = role === 'ADMIN';

  const load = async () => {
    setLoading(true);
    try {
      const [bRes, pRes, fRes] = await Promise.all([
        bookingApi.getAll(), passengerApi.getAll(), flightApi.getAll()
      ]);
      setBookings(bRes.data);
      setPassengers(pRes.data);
      setFlights(fRes.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: number, value: string) => {
    try {
      const res = await bookingApi.updateStatus(id, value);
      setBookings((prev) => prev.map((b) => b.id === id ? res.data : b));
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingApi.delete(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.success('Booking cancelled');
    } catch { toast.error('Delete failed'); }
  };

  const filtered = bookings.filter((b) =>
    !search ||
    b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
    b.passengerName.toLowerCase().includes(search.toLowerCase()) ||
    b.flightNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Ticket className="w-6 h-6 text-primary-400" /> Bookings
            </h1>
            <p className="text-slate-400 text-sm">{bookings.length} total bookings</p>
          </div>
          <div className="flex gap-3">
            <button onClick={load} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            {isAdmin && (
              <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Booking
              </button>
            )}
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search ref, passenger, flight..."
            value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10"
          />
        </div>

        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-airport-card/50">
              <tr className="text-slate-400 text-left">
                {['Reference','Passenger','Flight','Seat','Booked On','Status','Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-airport-border">
              {filtered.map((b, i) => (
                <motion.tr key={b.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-airport-card/40 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-primary-400 font-bold">
                    {b.bookingReference}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{b.passengerName}</td>
                  <td className="px-4 py-3 text-slate-300">{b.flightNumber}</td>
                  <td className="px-4 py-3 text-slate-400">{b.seatNumber || '—'}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(b.bookingTime).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    {isAdmin ? (
                      <>
                        <select value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          className="bg-transparent border-0 text-xs font-semibold cursor-pointer focus:outline-none">
                          {['CONFIRMED','CHECKED_IN','BOARDED','CANCELLED'].map((s) => (
                            <option key={s} value={s} className="bg-airport-panel">{s}</option>
                          ))}
                        </select>
                        <span className={STATUS_BADGES[b.status] || 'badge-gray'}> {b.status}</span>
                      </>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_BADGES[b.status] || 'badge-gray'}`}>{b.status}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isAdmin ? (
                      <button onClick={() => handleDelete(b.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 italic">View Only</span>
                    )}
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <BookingModal
            passengers={passengers} flights={flights}
            onClose={() => setModal(false)}
            onSaved={(b) => setBookings((prev) => [b, ...prev])}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
