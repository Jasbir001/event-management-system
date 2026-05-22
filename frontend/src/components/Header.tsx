import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/Logo.png';
import { Menu, X, ArrowRight } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll to transform the navbar into a floating pill
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/eventbooks' },
    { name: 'My Bookings', path: '/mybooking' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 transition-all duration-500 sm:px-6 lg:px-8">
      <nav 
        className={`mx-auto max-w-7xl transition-all duration-500 rounded-full ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200/50 py-3 px-4 lg:px-6' 
            : 'bg-transparent py-4 px-2'
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-gray-200 transition-transform duration-300 group-hover:scale-105">
               <img 
                 src={logo} 
                 alt="Event Xpress Logo" 
                 className="h-8 w-8 object-contain transition-transform duration-300 group-hover:rotate-3" 
               />
            </div>
            <span className="hidden items-center gap-1 sm:flex tracking-tight">
              <span className="text-xl font-medium text-gray-800">Event</span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Xpress</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center space-x-1 rounded-full bg-gray-50/80 p-1 backdrop-blur-md border border-gray-200/60 shadow-inner">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-6 py-2 text-sm font-semibold transition-all duration-300 rounded-full ${
                    isActive 
                      ? 'text-blue-700 shadow-sm' 
                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100/50'
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] -z-10" />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Section: Actions */}
          <div className="hidden lg:flex items-center gap-5">
            <Link 
              to="/login" 
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              Log in
            </Link>
            <div className="h-4 w-px bg-gray-300"></div>
            <Link 
              to="/mybooking" 
              className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-full shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Book Now
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden absolute top-[calc(100%+0.5rem)] left-4 right-4 rounded-3xl bg-white/95 backdrop-blur-2xl border border-gray-100 shadow-[0_20px_40px_rgb(0,0,0,0.1)] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top ${
          isMenuOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-4 invisible'
        }`}
      >
        <div className="p-4 flex flex-col gap-2">
          {navLinks.map((link) => {
             const isActive = location.pathname === link.path;
             return (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-5 py-3.5 rounded-2xl text-base font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
          
          <div className="h-px bg-gray-100 my-3 mx-2"></div>
             
          <div className="flex flex-col gap-2 px-2 pb-2">
            <Link 
              to="/login" 
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 text-gray-700 font-semibold text-center hover:bg-gray-50 hover:border-gray-200 transition-colors"
            >
              Log in
            </Link>
            <Link 
              to="/mybooking" 
              className="w-full px-4 py-3 rounded-2xl bg-gray-900 text-white font-semibold text-center shadow-lg hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
            >
              Book Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
