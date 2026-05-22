// src/components/Footer.tsx
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-gray-800 bg-black text-gray-300">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 h-px w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 blur-[2px]"></div>
      <div className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 xl:gap-16">
          {/* Brand & Intro */}
          <div className="space-y-6">
            <Link to="/" className="group inline-flex items-baseline gap-1">
              <span className="text-2xl font-light text-white tracking-tight">Event</span>
              <span className="text-3xl font-bold text-primary transition-all duration-300 group-hover:opacity-80">Xpress</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Turning your event dreams into spectacular realities. We handle planning, logistics, and execution with precision and passion.
            </p>
            <div className="flex gap-4">
              {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon].map((Icon, i) => (
                <a key={i} href="#" className="group rounded-full border border-gray-800 bg-gray-900 p-2.5 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary/10 hover:text-primary">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              {[
                { name: 'Our Events', path: '/eventbooks' },
                { name: 'My Booking', path: '/mybooking' },
                { name: 'Login', path: '/login' },
                { name: 'Create Account', path: '/useraccount' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="group flex items-center gap-2 text-gray-400 transition-colors hover:text-primary">
                    <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-4"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">Our Services</h3>
            <ul className="space-y-4 text-sm">
              {['Birthday Parties', 'Corporate Events', 'Night Parties', 'Entertainment'].map((service) => (
                <li key={service}>
                  <span className="group flex cursor-pointer items-center gap-2 text-gray-400 transition-colors hover:text-primary">
                    <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-4"></span>
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Get in Touch</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="group flex items-start gap-3 transition-colors hover:text-white">
                <MapPin className="mt-0.5 shrink-0 text-primary transition-transform group-hover:scale-110" size={18} />
                <span>Sector 34A, Chandigarh, 160047</span>
              </li>
              <li className="group flex items-center gap-3 transition-colors hover:text-white">
                <Mail className="shrink-0 text-primary transition-transform group-hover:scale-110" size={18} />
                <a href="mailto:contact@eventxpress.com">contact@eventxpress.com</a>
              </li>
              <li className="group flex items-center gap-3 transition-colors hover:text-white">
                <Phone className="shrink-0 text-primary transition-transform group-hover:scale-110" size={18} />
                <a href="tel:+917494996995">+91 7494996995</a>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="mb-3 text-xs font-medium text-gray-400">Subscribe to our newsletter</h4>
              <div className="relative flex items-center">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full rounded-full border border-gray-800 bg-gray-900 py-2.5 pl-4 pr-12 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105 active:scale-95">
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} <span className="font-semibold text-primary">EventXpress</span>. All Rights Reserved.
          </p>
          <div className="mt-4 flex gap-6 text-xs text-gray-500 sm:mt-0">
            <Link to="#" className="transition-colors hover:text-primary">Privacy Policy</Link>
            <Link to="#" className="transition-colors hover:text-primary">Terms of Service</Link>
            <Link to="#" className="transition-colors hover:text-primary">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
