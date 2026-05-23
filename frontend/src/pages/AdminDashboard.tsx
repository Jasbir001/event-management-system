import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Users, Calendar, Mail, Phone, RefreshCw } from "lucide-react";

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  time: string;
  end_time: string;
  apxsize: string;
  status: 'pending' | 'approved' | 'rejected';
}

const formatSize = (sizeStr: string) => {
  if (sizeStr === 'mini_party') return 'Mini Party';
  if (sizeStr === 'family_function') return 'Family Function';
  if (sizeStr === 'corporate_gathering') return 'Corporate Gathering';
  return sizeStr;
};

const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  const [promoForm, setPromoForm] = useState({ title: '', description: '', price_info: 'Free', event_date: '' });
  const [promoLoading, setPromoLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/mybooking` : '/api/mybooking';
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/booking/${id}/status` : `/api/booking/${id}/status`;
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        // Update local state to reflect change instantly
        setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/promotions` : '/api/promotions';
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promoForm)
      });
      if (res.ok) {
        alert("Promotion Created Successfully! It is now live for users.");
        setPromoForm({ title: '', description: '', price_info: 'Free', event_date: '' });
      } else {
        alert("Failed to create promotion");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <div className="page-shell pb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
            Management
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">Admin <span className="text-blue-600">Dashboard</span></h1>
        </div>
        <button 
          onClick={fetchBookings} 
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </header>

      {/* Add Promotion Form */}
      <div className="mb-12 rounded-2xl border border-blue-100 bg-blue-50/30 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          ✨ Create Special Event Popup
        </h2>
        <form onSubmit={handlePromoSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
            <input 
              required type="text" 
              value={promoForm.title} onChange={e => setPromoForm({...promoForm, title: e.target.value})}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" 
              placeholder="e.g. Free Yoga Camp" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Date & Time (Expiry)</label>
            <input 
              required type="datetime-local" 
              value={promoForm.event_date} onChange={e => setPromoForm({...promoForm, event_date: e.target.value})}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              required rows={2}
              value={promoForm.description} onChange={e => setPromoForm({...promoForm, description: e.target.value})}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" 
              placeholder="Join us for an amazing evening..." 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Info</label>
            <input 
              type="text" 
              value={promoForm.price_info} onChange={e => setPromoForm({...promoForm, price_info: e.target.value})}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" 
              placeholder="e.g. Free, Rs. 500 Basic Entry" 
            />
          </div>
          <div className="flex items-end">
            <button 
              type="submit" disabled={promoLoading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 font-bold text-white shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {promoLoading ? 'Publishing...' : 'Publish Popup to Users'}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Event Duration</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>
                    <p className="mt-2 text-gray-500 font-medium">Loading bookings...</p>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">No bookings found in the system.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{booking.name}</p>
                      <div className="mt-1 flex flex-col gap-0.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {booking.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {booking.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-1 font-medium text-green-700 bg-green-50 w-fit px-2 py-0.5 rounded">
                          <Calendar className="h-3 w-3" /> 
                          {new Date(booking.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-red-700 bg-red-50 w-fit px-2 py-0.5 rounded">
                          <Clock className="h-3 w-3" /> 
                          {booking.end_time ? new Date(booking.end_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'TBD'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                        <Users className="h-3.5 w-3.5" />
                        {formatSize(booking.apxsize)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {booking.status === 'approved' && <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800"><CheckCircle className="h-3.5 w-3.5" /> Approved</span>}
                      {booking.status === 'rejected' && <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800"><XCircle className="h-3.5 w-3.5" /> Rejected</span>}
                      {(!booking.status || booking.status === 'pending') && <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">Pending</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {booking.status === 'pending' || !booking.status ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(booking.id, 'approved')}
                            disabled={actionLoading === booking.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50"
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                            disabled={actionLoading === booking.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Action Taken</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
