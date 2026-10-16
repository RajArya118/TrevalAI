import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Heart, Shield, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-sky-400 flex items-center justify-center text-white shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Travel<span className="text-sky-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Next-generation travel platform combining live destination discovery, curated luxury & budget hotel bookings, and autonomous Google Gemini AI trip itinerary generation.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-sky-400">
                <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini AI
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-emerald-400">
                <Shield className="w-3.5 h-3.5" /> Verified Bookings
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/destinations" className="hover:text-sky-400 transition-colors">
                  Top Destinations
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="hover:text-sky-400 transition-colors">
                  Hotels & Resorts
                </Link>
              </li>
              <li>
                <Link to="/ai-planner" className="hover:text-sky-400 transition-colors flex items-center gap-1">
                  AI Trip Planner
                  <span className="text-[10px] font-bold bg-sky-500 text-white px-1.5 rounded">NEW</span>
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=Beach" className="hover:text-sky-400 transition-colors">
                  Beach Vacations
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=Mountain" className="hover:text-sky-400 transition-colors">
                  Mountain Escapes
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-sky-400 transition-colors">
                  About TravelAI
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-sky-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-sky-400 transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-sky-400 transition-colors">
                  Admin Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>support@travelai.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>New Delhi / Bangalore, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TravelAI Inc. Crafted for BCA Fresher Full-Stack Portfolio.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Chandrabhan
          </p>
        </div>
      </div>
    </footer>
  );
};
