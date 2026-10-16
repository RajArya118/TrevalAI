import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Calendar,
  Wallet,
  Sparkles,
  Heart,
  ChevronLeft,
  CheckCircle,
  Building,
} from 'lucide-react';
import { Destination } from '../types';
import { destinationService } from '../services/destination.service';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { HotelCard } from '../components/hotel/HotelCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const DestinationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    destinationService
      .getById(id)
      .then((data: any) => {
        setDestination(data);
        setIsSaved(data.isSaved || false);
      })
      .catch((err) => {
        console.error(err);
        toast('Destination not found', 'error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleSaved = async () => {
    if (!destination) return;
    if (!isAuthenticated) {
      toast('Please sign in to save destinations', 'info');
      navigate('/login');
      return;
    }

    try {
      const res = await destinationService.toggleSaved(destination.id);
      setIsSaved(res.isSaved);
      toast(res.message, 'success');
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading destination details...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Destination Not Found</h2>
        <Link to="/destinations" className="text-sky-600 font-semibold hover:underline">
          Return to Destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Large Hero Banner */}
      <div className="relative h-[480px] lg:h-[540px] w-full overflow-hidden bg-navy-950">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-black/30" />

        {/* Back Link & Save Button */}
        <div className="absolute top-6 inset-x-4 sm:inset-x-8 max-w-7xl mx-auto flex items-center justify-between z-10">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-slate-800 text-xs font-bold shadow-md transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Explore
          </Link>

          <button
            onClick={handleToggleSaved}
            className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md text-xs font-bold transition-all shadow-md ${
              isSaved
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 hover:bg-white text-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            {isSaved ? 'Saved to Wishlist' : 'Save Destination'}
          </button>
        </div>

        {/* Banner Details */}
        <div className="absolute bottom-10 inset-x-4 sm:inset-x-8 max-w-7xl mx-auto text-white">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${getCategoryColor(
                destination.category
              )}`}
            >
              {destination.category}
            </span>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{destination.rating.toFixed(1)} Rating</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">
            {destination.name}
          </h1>

          <p className="flex items-center gap-1.5 text-sm sm:text-base text-slate-200 font-medium drop-shadow">
            <MapPin className="w-4 h-4 text-sky-400" />
            {destination.city}, {destination.country}
          </p>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column (2 Cols): Overview & Attractions */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-navy-900 tracking-tight">About Destination</h2>
              <p className="text-slate-600 text-base leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Attractions */}
            {destination.attractions && destination.attractions.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-navy-900 tracking-tight">
                  Iconic Highlights & Attractions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.attractions.map((attraction: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                      <span className="text-sm font-semibold text-slate-800">{attraction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Quick Stats Card & AI Planner CTA */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-navy-900">Trip Overview</h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
                  <Wallet className="w-5 h-5 text-sky-600 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Estimated Budget</span>
                    <span className="font-bold text-navy-900 text-base">
                      {formatCurrency(destination.estimatedBudget)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
                  <Calendar className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Best Season</span>
                    <span className="font-bold text-navy-900 text-base">
                      {destination.bestTimeToVisit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: AI Planner */}
              <Link
                to={`/ai-planner?destination=${encodeURIComponent(destination.city || destination.name)}`}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                Plan Itinerary for {destination.city}
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Associated Hotels in this Destination */}
        {destination.hotels && destination.hotels.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-navy-900 tracking-tight">
                  Top Places to Stay in {destination.city}
                </h3>
                <p className="text-xs text-slate-500">
                  Curated luxury and boutique stays verified in our database.
                </p>
              </div>

              <Link
                to={`/hotels?destinationId=${destination.id}`}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 underline underline-offset-4"
              >
                View All Stays
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.hotels.map((hotel: any) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
