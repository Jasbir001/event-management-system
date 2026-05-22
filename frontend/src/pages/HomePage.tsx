// src/pages/HomePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Sparkles } from "lucide-react";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/submit_from`, {
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

      {/* Appointment */}
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
