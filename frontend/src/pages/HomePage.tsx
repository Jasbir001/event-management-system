// src/pages/HomePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Sparkles, Award, Users, ThumbsUp, Clock, Star } from "lucide-react";
import bdyImg from '../assets/images/bdy.jpg';
import nightImg from '../assets/images/night.jpg';
import corporateImg from '../assets/images/corporate.jpg';
import jokerImg from '../assets/images/joker.jpg';
import girlRight from "../assets/images/girl_right.jpg";

const services = [
  {
    img: bdyImg,
    alt: "birthday_party",
    title: "Birthday Parties",
    emoji: "🎂",
    desc: "Make every birthday unforgettable! Stylish decorations, cakes, music, lighting, and fun activities for all ages.",
  },
  {
    img: nightImg,
    alt: "night_party",
    title: "Night Parties",
    emoji: "🌙",
    desc: "Club-style parties, DJ nights, or casual hangouts — lights, music, energy, and ambiance for unforgettable nights.",
  },
  {
    img: corporateImg,
    alt: "corporate_party",
    title: "Corporate Events",
    emoji: "🎉",
    desc: "Meetings, conferences, seminars, and office celebrations with seamless coordination and premium setups.",
  },
  {
    img: jokerImg,
    alt: "entertain_party",
    title: "Entertainment / Jokers",
    emoji: "🤡",
    desc: "Jokers, live performers, magicians, and kids' activities — joy and laughter for every celebration.",
  },
];

const stats = [
  { icon: Award, label: "Events Organized", value: "500+", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Users, label: "Happy Clients", value: "10k+", color: "text-purple-500", bg: "bg-purple-50" },
  { icon: ThumbsUp, label: "Satisfaction Rate", value: "97%", color: "text-green-500", bg: "bg-green-50" },
  { icon: Clock, label: "Years Experience", value: "6+", color: "text-orange-500", bg: "bg-orange-50" },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    Appointment_time: "",
    event_type: "",
  });

  const [reviewsData, setReviewsData] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const [reviewForm, setReviewForm] = useState({ name: "", role: "", review: "", rating: 5 });
  
  // Promotional Popup State
  const [activePromotion, setActivePromotion] = useState<any>(null);
  const [showPromoPopup, setShowPromoPopup] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("userLoggedIn") === "true");
    setUserRole(localStorage.getItem("userRole") || "user");
    fetchReviews();
    fetchPromotion();
  }, []);

  const fetchPromotion = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/promotions/active` : '/api/promotions/active';
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && data.title) {
          setActivePromotion(data);
          setShowPromoPopup(true);
        }
      }
    } catch (err) {
      console.error("Failed to fetch promotions", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/reviews` : '/api/reviews';
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setReviewsData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/reviews` : '/api/reviews';
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      const data = await res.json();
      if (data.success) {
        alert("Review added successfully!");
        setReviewForm({ name: "", role: "", review: "", rating: 5 });
        fetchReviews();
      } else {
        alert(data.msg || "Failed to add review");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/submit_from` : '/api/submit_from';
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      alert(data.msg || "Appointment booked!");
      navigate("/mybooking");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-shell">
      {/* Marquee */}
      <div className="mb-8 rounded-xl bg-primary text-white shadow-md shadow-blue-500/20">
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[0, 1].map((i) => (
              <span key={i} className="ticker-text">
                Welcome to Our Event Management System – Plan Your Perfect Celebration! ✔️ Book Your Birthdays, Night Parties, Meetings & More — Hassle Free! ✔️ Make Every Event Special With Our Professional Event Services! ✔️ From Food to Fun — We Make Your Events Unforgettable! ✔️ Celebrate Every Moment With Style — Book Your Event Today!
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="mb-12 text-center">
        <p className="section-label">EventXpress</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          <span className="bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
            Plan Your Perfect Celebration
          </span>
        </h1>
        <p className="page-subtitle mt-4">
          Professional planning for birthdays, night parties, corporate events, and entertainment — all in one place.
        </p>
      </section>

      {/* Service cards */}
      <section className="mb-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="section-label">What we offer</p>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Our Services</h2>
          </div>
          <Sparkles className="hidden h-8 w-8 text-blue-500/40 sm:block" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((s) => (
            <article key={s.title} className="event-card group">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={s.img}
                  alt={s.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-2xl">{s.emoji}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{s.desc}</p>
                <button type="button" className="btn-primary mt-4 w-full">
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <div className="mb-8 text-center">
          <p className="section-label">Why Choose Us</p>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">The EventXpress Advantage</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-lg shadow-gray-200/50 border border-gray-100 transition-transform duration-300 hover:-translate-y-1">
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${stat.bg} ${stat.color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-16">
        <div className="mb-8 text-center">
          <p className="section-label">Client Reviews</p>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">What People Say About Us</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviewsData.map((testimonial: any, idx: number) => (
            <div key={idx} className="flex flex-col rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mb-6 flex-1 italic text-gray-600">"{testimonial.review}"</p>
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600 text-white font-bold">
                  {(testimonial.name || "A").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500">{testimonial.role || "Client"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoggedIn && (
          <div className="mt-12 mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="input-field"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Your Role (e.g. Birthday Party)"
                  className="input-field"
                  value={reviewForm.role}
                  onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                />
              </div>
              <textarea
                placeholder="Write your review here..."
                required
                rows={3}
                className="input-field w-full resize-none"
                value={reviewForm.review}
                onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
              ></textarea>
              <button type="submit" className="btn-gradient w-full">
                Submit Review
              </button>
            </form>
          </div>
        )}
      </section>

      {/* Appointment */}
      {userRole !== "admin" && (
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
        <div className="grid items-stretch lg:grid-cols-2">
          <div className="relative hidden min-h-[320px] lg:block">
            <img
              src={girlRight}
              alt="Book your event"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="section-label mb-0">Quick booking</p>
                <h3 className="text-2xl font-bold text-primary">Appointment Now</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                placeholder="Your Name"
                required
                className="input-field sm:col-span-2"
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="input-field"
                onChange={handleChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                required
                className="input-field"
                onChange={handleChange}
              />
              <input
                name="address"
                placeholder="Address"
                required
                className="input-field sm:col-span-2"
                onChange={handleChange}
              />
              <input
                type="datetime-local"
                name="Appointment_time"
                required
                className="input-field sm:col-span-2"
                onChange={handleChange}
              />
              <select
                name="event_type"
                required
                defaultValue=""
                className="input-field sm:col-span-2"
                onChange={handleChange}
              >
                <option value="" disabled>Select Event Type</option>
                <option value="wedding">Wedding 💑</option>
                <option value="birthday">Birthday Party 🎂</option>
                <option value="corporate">Corporate Event 🧟‍♂️</option>
                <option value="social">सामाजिक समारोह 😉</option>
                <option value="other">Other</option>
              </select>
              <button type="submit" className="btn-gradient w-full sm:col-span-2">
                Book Appointment
              </button>
            </form>
            {/* Empty Space padding */}
            <div className="pb-10"></div>
          </div>
        </div>
      </section>
      )}

      {/* Promotional Popup Modal */}
      {showPromoPopup && activePromotion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white relative">
               <button 
                 onClick={() => setShowPromoPopup(false)}
                 className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
               >
                 ✕
               </button>
               <h3 className="text-2xl font-black px-4">{activePromotion.title}</h3>
            </div>
            <div className="p-6 text-center">
               <p className="text-gray-600 mb-6">{activePromotion.description}</p>
               <div className="mb-6 flex flex-col gap-2 rounded-xl bg-blue-50/50 p-4 border border-blue-100">
                 <div className="flex items-center justify-center gap-2 text-blue-700 font-semibold">
                   <Calendar className="h-5 w-5" />
                   <span>{new Date(activePromotion.event_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                 </div>
                 {activePromotion.price_info && (
                   <div className="text-sm font-bold text-gray-800 mt-2">
                     Entry Ticket: <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded ml-1">{activePromotion.price_info}</span>
                   </div>
                 )}
               </div>
               <div className="flex gap-3">
                 <button 
                   onClick={() => setShowPromoPopup(false)}
                   className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                 >
                   Maybe Later
                 </button>
                 <button 
                   onClick={() => { setShowPromoPopup(false); navigate('/eventbooked'); }}
                   className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 font-bold text-white shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
                 >
                   Book Now!
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;
