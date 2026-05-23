import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Users, Calendar, Mail, Phone, RefreshCw, MessageSquare, Trash2, List } from "lucide-react";

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  time: string;
  end_time: string;
  apxsize: string;
  status: 'pending' | 'approved' | 'rejected';
  payment_status: 'pending' | 'received';
}

interface Appointment {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  appointment_datetime: string;
  event_type: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
}

const formatSize = (sizeStr: string) => {
  if (sizeStr === 'mini_party') return 'Mini Party';
  if (sizeStr === 'family_function') return 'Family Function';
  if (sizeStr === 'corporate_gathering') return 'Corporate Gathering';
  return sizeStr;
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'appointments' | 'contacts'>('bookings');
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<number | null>(null);
  
  const [promoForm, setPromoForm] = useState({ title: '', description: '', price_info: 'Free', event_date: '' });
  const [promoLoading, setPromoLoading] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const bApiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/mybooking` : '/api/mybooking';
      const aApiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/appointment` : '/api/appointment';
      const cApiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/contact` : '/api/contact';
      
      const [bRes, aRes, cRes] = await Promise.all([
        fetch(`${bApiUrl}?role=admin`),
        fetch(aApiUrl),
        fetch(cApiUrl)
      ]);

      if (bRes.ok) setBookings(await bRes.json());
      if (aRes.ok) setAppointments(await aRes.json());
      if (cRes.ok) setContacts(await cRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
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
      if (res.ok) setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePaymentUpdate = async (id: number, payment_status: 'received' | 'pending') => {
    setPaymentLoading(id);
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/booking/${id}/payment` : `/api/booking/${id}/payment`;
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status })
      });
      if (res.ok) setBookings(bookings.map(b => b.id === id ? { ...b, payment_status } : b));
    } catch (err) {
      console.error(err);
    } finally {
      setPaymentLoading(null);
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    if (!window.confirm("Delete this appointment request?")) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/appointment/${id}` : `/api/appointment/${id}`;
      const res = await fetch(apiUrl, { method: "DELETE" });
      if (res.ok) setAppointments(appointments.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!window.confirm("Delete this contact message?")) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/contact/${id}` : `/api/contact/${id}`;
      const res = await fetch(apiUrl, { method: "DELETE" });
      if (res.ok) setContacts(contacts.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
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
        alert("Promotion Created Successfully!");
        setPromoForm({ title: '', description: '', price_info: 'Free', event_date: '' });
      }
    } catch (err) {
      console.error(err);
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
          onClick={fetchAllData} 
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100/80 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'bookings' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'}`}
        >
          <List className="w-4 h-4" /> Detailed Bookings
        </button>
        <button 
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'appointments' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'}`}
        >
          <Calendar className="w-4 h-4" /> Quick Appointments
        </button>
        <button 
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'contacts' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'}`}
        >
          <MessageSquare className="w-4 h-4" /> Contact Messages
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Event Details</th>
                    <th className="px-6 py-4">Status & Payment</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.length === 0 ? (
                    <tr><td colSpan={4} className="py-12 text-center text-gray-500">No bookings found.</td></tr>
                  ) : (
                    bookings.map(b => (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{b.name}</p>
                          <span className="text-xs text-gray-500">{b.email}<br/>{b.phone}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-600">
                            <strong>Date:</strong> {new Date(b.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}<br/>
                            <strong>Size:</strong> {formatSize(b.apxsize)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2 items-start">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${b.status === 'approved' ? 'bg-green-100 text-green-800' : b.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {b.status || 'pending'}
                            </span>
                            <select 
                              value={b.payment_status || 'pending'} 
                              onChange={(e) => handlePaymentUpdate(b.id, e.target.value as 'received' | 'pending')}
                              disabled={paymentLoading === b.id || b.status !== 'approved'}
                              className="text-xs font-bold rounded border px-2 py-1 outline-none cursor-pointer"
                            >
                              <option value="pending">Payment: Pending</option>
                              <option value="received">Payment: Received</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {(b.status === 'pending' || !b.status) && (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleStatusUpdate(b.id, 'approved')} className="text-green-600 hover:text-green-800"><CheckCircle className="w-5 h-5"/></button>
                              <button onClick={() => handleStatusUpdate(b.id, 'rejected')} className="text-red-600 hover:text-red-800"><XCircle className="w-5 h-5"/></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Promotion Form */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">✨ Create Event Popup</h2>
            <form onSubmit={handlePromoSubmit} className="flex flex-wrap items-end gap-4">
              <input required type="text" placeholder="Event Title" value={promoForm.title} onChange={e => setPromoForm({...promoForm, title: e.target.value})} className="input-field flex-1" />
              <input required type="text" placeholder="Description" value={promoForm.description} onChange={e => setPromoForm({...promoForm, description: e.target.value})} className="input-field flex-1" />
              <input required type="text" placeholder="Entry Ticket Price (e.g. Rs. 500)" value={promoForm.price_info} onChange={e => setPromoForm({...promoForm, price_info: e.target.value})} className="input-field flex-1" />
              <input required type="datetime-local" value={promoForm.event_date} onChange={e => setPromoForm({...promoForm, event_date: e.target.value})} className="input-field flex-1" />
              <button type="submit" disabled={promoLoading} className="btn-gradient px-8 py-2.5 rounded-xl">Publish</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/40 animate-in fade-in duration-300">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Customer Info</th>
                <th className="px-6 py-4">Requested Event</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.length === 0 ? (
                <tr><td colSpan={3} className="py-12 text-center text-gray-500">No appointment requests.</td></tr>
              ) : (
                appointments.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{a.name}</p>
                      <span className="text-xs text-gray-500">{a.email} • {a.mobile}</span>
                      <p className="text-xs text-gray-400 mt-1">{a.address}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded capitalize">{a.event_type}</span>
                      <div className="text-xs text-gray-500 mt-1">{new Date(a.appointment_datetime).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteAppointment(a.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/40 animate-in fade-in duration-300">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Message Details</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.length === 0 ? (
                <tr><td colSpan={3} className="py-12 text-center text-gray-500">No contact messages.</td></tr>
              ) : (
                contacts.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{c.name}</p>
                      <span className="text-xs text-gray-500">{c.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{c.subject}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.message}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteContact(c.id)} className="text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                        Resolve & Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
