import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, User, Mail, Phone, Calendar as CalendarIcon, Users, ArrowRight } from "lucide-react";

const EventBookedPage: React.FC = () => {
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    phone: "",
    startTime: "",
    endTime: "",
    apxsize: "",
  });
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; msg: string }>({
    type: "idle",
    msg: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("userLoggedIn") !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setStatus({ type: "error", msg: "End Time must be after Start Time." });
      return;
    }

    setStatus({ type: "loading", msg: "Processing booking..." });
    try {
      const apiUrl = ((import.meta.env.VITE_API_URL || '').endsWith('/api') ? `${import.meta.env.VITE_API_URL}/eventbooked` : (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/eventbooked` : '/api/eventbooked'));
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus({ type: "success", msg: data.msg || "Booking submitted successfully!" });
        setFormData({ naam: "", email: "", phone: "", startTime: "", endTime: "", apxsize: "" });
      } else {
        setStatus({ type: "error", msg: data.msg || "Error submitting booking" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Failed to connect to the server." });
    }
  };

  return (
    <div className="page-shell pb-20">
      <header className="mb-12 text-center">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-4">
          Reserve
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Event</span></h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Fill in the details below and our expert team will curate the perfect experience for you.
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12">
        {/* Main Form Area */}
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/50">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6 text-white">
              <h2 className="text-2xl font-bold">Booking Details</h2>
              <p className="text-gray-300 mt-1 text-sm">Please provide accurate information for seamless communication.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              {status.type !== "idle" && (
                <div className={`mb-6 rounded-xl p-4 text-sm font-medium ${status.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : status.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                  {status.msg}
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="naam" className="text-sm font-semibold text-gray-700">Full Name</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="naam" name="naam" required value={formData.naam} onChange={handleChange} className="input-field pl-11 w-full" placeholder="John Doe" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="email" name="email" type="email" value={formData.email} required onChange={handleChange} className="input-field pl-11 w-full" placeholder="john@example.com" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-sm font-semibold text-gray-700">Mobile No.</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="phone" name="phone" type="tel" value={formData.phone} required onChange={handleChange} className="input-field pl-11 w-full" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="startTime" className="text-sm font-semibold text-gray-700">Start Time</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="startTime" name="startTime" type="datetime-local" value={formData.startTime} required onChange={handleChange} className="input-field pl-11 w-full" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="endTime" className="text-sm font-semibold text-gray-700">End Time</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="endTime" name="endTime" type="datetime-local" value={formData.endTime} required onChange={handleChange} className="input-field pl-11 w-full" />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="apxsize" className="text-sm font-semibold text-gray-700">Party Size</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <select id="apxsize" name="apxsize" value={formData.apxsize} required className="input-field pl-11 w-full appearance-none bg-white" onChange={handleChange}>
                      <option value="" disabled>Select Option</option>
                      <option value="mini_party">Mini Party (1-15 guests)</option>
                      <option value="family_function">Family Function (15-40 guests)</option>
                      <option value="corporate_gathering">Corporate Gathering (40-100+ guests)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button type="submit" disabled={status.type === "loading"} className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50 active:scale-95 disabled:opacity-70 disabled:hover:scale-100">
                  {status.type === "loading" ? "Processing..." : "Confirm Booking"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 border border-blue-100/50">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                <ClipboardList className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">How It Works</h2>
            </div>
            
            <div className="relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-blue-200"></div>
              <ul className="space-y-6 relative">
                {[
                  { title: "Submit Request", desc: "Select a Start and End time for your event." },
                  { title: "Approval", desc: "We check availability and approve your slot." },
                  { title: "Confirmation", desc: "Finalize details, decorations, and complete payment." },
                  { title: "Enjoy", desc: "Relax while we manage everything on the big day!" }
                ].map((step, i) => (
                  <li key={step.title} className="flex gap-4 relative">
                    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-[0_0_0_4px_#eff6ff]">
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="font-bold text-gray-900">{step.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBookedPage;
