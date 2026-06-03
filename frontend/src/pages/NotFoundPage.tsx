// src/pages/NotFoundPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-shell flex min-h-[75vh] flex-col items-center justify-center py-12 px-4 text-center">
      {/* Decorative background shapes */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="absolute top-1/3 left-1/3 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-100/30 blur-3xl" />

      <div className="w-full max-w-xl">
        {/* Animated Compass / Icon container */}
        <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md ring-1 ring-blue-100/50">
          <div className="absolute -inset-0.5 animate-pulse rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-10 blur" />
          <Compass className="relative h-14 w-14 animate-[spin_12s_linear_infinite] text-primary" />
        </div>

        {/* 404 Header */}
        <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-8xl font-extrabold tracking-tight text-transparent sm:text-9xl">
          404
        </h1>
        
        {/* Heading */}
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-md text-base text-gray-600">
          Oops! The page you are looking for doesn't exist or has been moved to another URL. Let's get you back on track.
        </p>

        {/* Interactive Action Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            id="notfound-back-button"
            onClick={() => navigate(-1)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow active:scale-95 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          
          <button
            id="notfound-home-button"
            onClick={() => navigate('/')}
            className="btn-gradient inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Return Home
          </button>
        </div>

        {/* Quick Links / Helper */}
        <div className="mt-12 border-t border-gray-100 pt-8">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <button
              id="notfound-contact-link"
              onClick={() => navigate('/contact')}
              className="font-semibold text-primary hover:underline"
            >
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
