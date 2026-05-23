import React from "react";
import { Users, Target, Heart, Sparkles, Award, ShieldCheck } from "lucide-react";
import corporateImg from '../assets/images/corporate.jpg';
import nightImg from '../assets/images/night.jpg';

const AboutPage: React.FC = () => {
  return (
    <div className="page-shell pb-24">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <span className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 ring-1 ring-blue-500/20">
          Know More About Us
        </span>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-6xl mb-6">
          Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Unforgettable</span> Memories
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-500 md:text-xl">
          At EventXpress, we believe that every milestone deserves to be celebrated perfectly. From intimate family gatherings to grand corporate galas, we bring your vision to life.
        </p>
      </section>

      {/* Story & Image Section */}
      <section className="mb-24 mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-3xl -z-10 transform -rotate-3"></div>
            <img 
              src={corporateImg} 
              alt="Our Team" 
              className="rounded-2xl shadow-2xl object-cover h-[400px] w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900">6+</p>
                  <p className="text-sm font-semibold text-gray-500 uppercase">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:pl-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Founded with a passion for bringing people together, EventXpress started as a small team of creative planners. Over the past decade, we have grown into a premier event management company, trusted by thousands to orchestrate their most important days.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We don't just plan events; we design experiences. Our dedicated team works closely with you to understand your unique style, ensuring that every single detail—from lighting and decor to catering and entertainment—is flawless.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <Target className="h-5 w-5 text-blue-500" /> Precision
              </div>
              <div className="flex items-center gap-2 text-gray-700 font-semibold bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <Sparkles className="h-5 w-5 text-purple-500" /> Creativity
              </div>
              <div className="flex items-center gap-2 text-gray-700 font-semibold bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <ShieldCheck className="h-5 w-5 text-green-500" /> Reliability
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="mb-24 bg-gradient-to-b from-gray-50 to-white py-16 rounded-3xl border border-gray-100 px-6 sm:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">The principles that guide everything we do.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-pink-500 mb-6">
              <Heart className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Client First</h3>
            <p className="text-gray-600">Your vision is our priority. We listen, adapt, and execute perfectly to exceed your expectations every single time.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-6">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
            <p className="text-gray-600">We constantly stay ahead of trends, bringing fresh, modern, and highly creative concepts to your celebrations.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-500 mb-6">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Teamwork</h3>
            <p className="text-gray-600">Our planners, decorators, and coordinators work seamlessly together, ensuring your event runs without a single glitch.</p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="mx-auto max-w-5xl relative rounded-3xl overflow-hidden shadow-2xl">
        <img src={nightImg} alt="CTA Background" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
        <div className="relative p-10 md:p-16 text-center z-10">
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-6">Ready to Plan Your Next Big Event?</h2>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto text-lg">Let's sit together, grab a coffee, and turn your dream celebration into a reality.</p>
          <a href="/mybooking" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-bold text-gray-900 shadow-lg transition-transform hover:scale-105">
            Book an Appointment
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
