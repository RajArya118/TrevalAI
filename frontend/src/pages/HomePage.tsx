import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Palmtree,
  Mountain,
  Landmark,
  Compass,
  Building,
  TreePine,
  ArrowRight,
  ShieldCheck,
  Star,
  Quote,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Destination, Hotel } from '../types';
import { destinationService } from '../services/destination.service';
import { hotelService } from '../services/hotel.service';
import { DestinationCard } from '../components/destination/DestinationCard';
import { HotelCard } from '../components/hotel/HotelCard';
import { CardGridSkeleton } from '../components/common/SkeletonLoader';

export const HomePage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [loadingHotels, setLoadingHotels] = useState(true);

  // Search Bar state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    destinationService
      .getFeatured(6)
      .then((data) => setDestinations(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingDestinations(false));

    hotelService
      .getFeatured(4)
      .then((data) => setHotels(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingHotels(false));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (searchCategory) params.append('category', searchCategory);
    navigate(`/destinations?${params.toString()}`);
  };

  const categories = [
    { name: 'Beach', icon: Palmtree, color: 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100 border-cyan-200' },
    { name: 'Mountain', icon: Mountain, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
    { name: 'Heritage', icon: Landmark, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200' },
    { name: 'Adventure', icon: Compass, color: 'text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200' },
    { name: 'Nature', icon: TreePine, color: 'text-teal-600 bg-teal-50 hover:bg-teal-100 border-teal-200' },
    { name: 'Urban', icon: Building, color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200' },
  ];

  const testimonials = [
    {
      quote:
        'The AI Trip Planner created a day-by-day Goa itinerary that perfectly balanced beach shack relaxation with Portuguese heritage walks. Saved us hours of research!',
      author: 'Aarav Mehta',
      location: 'Mumbai, India',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      quote:
        'The transparent INR cost breakdown was spot on for our family trip to Manali. Booking hotels directly linked to the itinerary made everything effortless.',
      author: 'Pooja Iyer',
      location: 'Bangalore, India',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      quote:
        'Cleanest travel UI I have seen. The combination of verified hotels, smart filters, and Gemini AI itinerary generation makes TravelAI a true game changer.',
      author: 'Rohan Verma',
      location: 'New Delhi, India',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center bg-navy-950 text-white overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1800&q=80"
            alt="Travel Hero Banner"
            className="w-full h-full object-cover object-center opacity-30 scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-900/80 to-slate-50" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center py-16 sm:py-24">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Next-Gen Travel Booking & Autonomous AI Itineraries</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-sm"
          >
            Discover Your Next Journey with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">Intelligent AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Explore breathtaking destinations, book verified luxury & boutique stays, and generate tailored day-by-day itineraries with live budget calculations in INR.
          </motion.p>

          {/* Dynamic Search Box */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/40 max-w-4xl mx-auto text-slate-800 flex flex-col md:flex-row items-center gap-3"
          >
            {/* Input 1: Destination Search */}
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/10 transition-all">
              <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
              <input
                type="text"
                placeholder="Where do you want to go? (e.g. Goa, Manali, Bali...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Input 2: Category Selector */}
            <div className="w-full md:w-56 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-sky-500 transition-all">
              <Compass className="w-5 h-5 text-sky-600 shrink-0" />
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="Beach">Beach</option>
                <option value="Mountain">Mountain</option>
                <option value="Heritage">Heritage</option>
                <option value="Adventure">Adventure</option>
                <option value="Nature">Nature</option>
                <option value="Urban">Urban</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 hover:shadow-sky-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </motion.form>

          {/* Quick AI Planner CTA Link */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-400">
            <span>Looking for custom itinerary?</span>
            <Link
              to="/ai-planner"
              className="text-sky-300 hover:text-white font-bold flex items-center gap-1 underline underline-offset-4 transition-colors"
            >
              Plan with Gemini AI
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. TRAVEL CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mb-2">
            Explore by Travel Vibe
          </h2>
          <p className="text-sm text-slate-500">
            Choose your preferred travel style to discover handpicked destinations and stays.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.name}
                to={`/destinations?category=${c.name}`}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${c.color}`}
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-slate-800">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 block mb-1">
              Top Trending
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Featured Destinations
            </h2>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1 text-sm font-bold text-sky-600 hover:text-sky-700 hover:gap-2 transition-all"
          >
            View All Destinations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingDestinations ? (
          <CardGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        )}
      </section>

      {/* 4. AI TRIP PLANNER SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-navy-900 via-sky-950 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-sky-900/50">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Intelligent Gemini AI Planner
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Get a Complete Custom Itinerary in Seconds
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
              Tell TravelAI your destination, dates, budget in Indian Rupees, and travel vibe. We generate a full day-by-day morning, afternoon, and evening schedule with realistic cost estimates and linked hotels.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/ai-planner"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Launch AI Trip Planner
              </Link>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Free • No Credit Card Required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. POPULAR HOTELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 block mb-1">
              Top Rated Stays
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Popular Hotels & Resorts
            </h2>
          </div>
          <Link
            to="/hotels"
            className="inline-flex items-center gap-1 text-sm font-bold text-sky-600 hover:text-sky-700 hover:gap-2 transition-all"
          >
            Browse All Hotels
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingHotels ? (
          <CardGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
        )}
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-100/60 py-16 rounded-3xl border border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600 block mb-1">
            Community Feedback
          </span>
          <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Loved by Modern Travelers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <Quote className="w-8 h-8 text-sky-200 mb-3" />
                <p className="text-sm text-slate-600 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-navy-900">{t.author}</h4>
                  <p className="text-[11px] text-slate-400">{t.location}</p>
                </div>
                <div className="ml-auto flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
