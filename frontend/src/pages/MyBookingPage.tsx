import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, Phone, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  time: string; // Used as StartTime now
  end_time: string;
  apxsize: string;
  status: 'pending' | 'approved' | 'rejected';
}

const formatSize = (sizeStr: string) => {
  if (sizeStr === 'mini_party') return 'Mini Party (1-15)';
  if (sizeStr === 'family_function') return 'Family Function (15-40)';
  if (sizeStr === 'corporate_gathering') return 'Corporate Gathering (40+)';
  return sizeStr;
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'approved') return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
      <CheckCircle className="w-3.5 h-3.5" /> Approved
    </span>
  );
  if (status === 'rejected') return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
      <XCircle className="w-3.5 h-3.5" /> Rejected
    </span>
  );
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
      <AlertCircle className="w-3.5 h-3.5" /> Pending
    </span>
  );
};

const MyBookingPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("userLoggedIn") !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const role = sessionStorage.getItem("userRole") || "user";
        const email = sessionStorage.getItem("userEmail") || "";
        const apiUrl = import.meta.env.VITE_API_URL 
          ? `${import.meta.env.VITE_API_URL}/mybooking?role=${role}&email=${encodeURIComponent(email)}` 
          : `/api/mybooking?role=${role}&email=${encodeURIComponent(email)}`;
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
    fetchBookings();
  }, []);

  return (
    <div className="page-shell pb-20">
      <header className="mb-12 text-center">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-4">
          Your schedule
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Bookings</span></h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          All your event appointments and their current approval status.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
              <Calendar className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No bookings yet</h3>
            <p className="mt-2 max-w-sm text-gray-500">You haven't scheduled any events with us yet.</p>
            <a href="/eventbooked" className="mt-8 inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-3 font-semibold text-white transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-gray-900/20">
              Book an Event
            </a>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex justify-end">
            <a href="/eventbooked" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 shadow-md shadow-blue-500/30">
              <Calendar className="h-4 w-4" />
              Book New Event
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600 rounded-l-3xl"></div>
                
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <h2 className="text-xl font-bold text-gray-900 truncate pr-4">{b.name}</h2>
                  <StatusBadge status={b.status || 'pending'} />
                </div>
                
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 text-sm text-gray-600 sm:col-span-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</p>
                      <p className="font-medium text-gray-900">
                        {new Date(b.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} 
                        {' - '}
                        {b.end_time ? new Date(b.end_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'TBD'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Party Size</p>
                      <p className="font-medium text-gray-900">{formatSize(b.apxsize)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-600">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</p>
                      <p className="font-medium text-gray-900">{b.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingPage;
