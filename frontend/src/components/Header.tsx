import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/Logo.png';
import { Menu, X, ArrowRight } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("userLoggedIn") === "true");
    setUserRole(localStorage.getItem("userRole") || "user");
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/logout` : '/api/logout';
      await fetch(apiUrl, { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  let navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'My Bookings', path: '/mybooking' },
    { name: 'Contact', path: '/contact' },
  ];

  if (userRole === "admin") {
    navLinks = [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
      { name: 'My Bookings', path: '/mybooking' },
      { name: 'Admin Dashboard', path: '/admin' }
    ];
  }

  return (
    <header className="w-full flex flex-col relative z-50">
      {/* ... previous code unchanged ... */}
      <div className={`sticky top-0 z-50 transition-all duration-300 w-full ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-gray-100 py-3' 
          : 'bg-white/90 backdrop-blur-md border-b border-gray-200/50 py-4'
      }`}>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm ring-1 ring-blue-100 transition-transform duration-300 group-hover:scale-105">
                 <img 
                   src={logo} 
                   alt="Event Xpress Logo" 
                   className="h-8 w-8 object-contain transition-transform duration-300 group-hover:rotate-3" 
                 />
              </div>
              <span className="hidden items-center gap-1 sm:flex tracking-tight">
                <span className="text-2xl font-semibold text-gray-900">Event</span>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Xpress</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center space-x-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-5 py-2 text-[15px] font-semibold transition-all duration-300 rounded-lg ${
                      isActive 
                        ? 'text-blue-700 bg-blue-50/80 shadow-sm border border-blue-100/50' 
                        : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Section: Actions */}
            <div className="hidden lg:flex items-center gap-6">
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="text-[15px] font-bold text-red-600 hover:text-red-700 transition-colors"
                >
                  Log out
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="text-[15px] font-bold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Log in
                </Link>
              )}
              {userRole !== "admin" && (
                <Link 
                  to="/mybooking" 
                  className="group flex items-center gap-2 px-6 py-2.5 text-[15px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  Book Now
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div 
          className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-2xl overflow-hidden transition-all duration-300 origin-top ${
            isMenuOpen ? 'opacity-100 scale-y-100 max-h-[500px]' : 'opacity-0 scale-y-95 max-h-0'
          }`}
        >
          <div className="p-4 flex flex-col gap-2 bg-slate-50/50">
            {navLinks.map((link) => {
               const isActive = location.pathname === link.path;
               return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-5 py-3.5 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-100/50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
            
            <div className="h-px bg-gray-200 my-2 mx-2"></div>
               
            <div className="flex flex-col gap-3 px-2 pb-4">
              <Link 
                to="/login" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 font-bold text-center hover:bg-gray-100 transition-colors"
              >
                Log in
              </Link>
              <Link 
                to="/mybooking" 
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-center shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2"
              >
                Book Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
