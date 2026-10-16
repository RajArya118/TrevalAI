import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Destination } from '../../types';
import { formatCurrency, getCategoryColor } from '../../utils/formatters';
import { destinationService } from '../../services/destination.service';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface DestinationCardProps {
  destination: Destination;
  onSavedChange?: (id: string, isSaved: boolean) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onSavedChange }) => {
  const [isSaved, setIsSaved] = useState(destination.isSaved || false);
  const [saving, setSaving] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleToggleSaved = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast('Please sign in to save destinations to your wishlist', 'info');
      navigate('/login');
      return;
    }

    try {
      setSaving(true);
      const res = await destinationService.toggleSaved(destination.id);
      setIsSaved(res.isSaved);
      toast(res.message, 'success');
      if (onSavedChange) {
        onSavedChange(destination.id, res.isSaved);
      }
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-100">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md shadow-sm ${getCategoryColor(
              destination.category
            )}`}
          >
            {destination.category}
          </span>

          <button
            onClick={handleToggleSaved}
            disabled={saving}
            className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
              isSaved
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
            }`}
            title={isSaved ? 'Remove from wishlist' : 'Save destination'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Image Overlay: City, Country & Rating */}
        <div className="absolute bottom-3.5 inset-x-3.5 flex items-end justify-between text-white">
          <div className="flex items-center gap-1.5 text-xs font-semibold drop-shadow">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>{destination.city}, {destination.country}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold text-amber-300">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
            <span>{destination.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-navy-900 group-hover:text-sky-600 transition-colors line-clamp-1 mb-1.5">
            {destination.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {destination.description}
          </p>

          {/* Attraction chips */}
          {destination.attractions && destination.attractions.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {destination.attractions.slice(0, 2).map((a, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md truncate max-w-[140px]"
                >
                  {a}
                </span>
              ))}
              {destination.attractions.length > 2 && (
                <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                  +{destination.attractions.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer: Budget & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Avg. Budget
            </span>
            <span className="text-sm font-extrabold text-navy-900">
              {formatCurrency(destination.estimatedBudget)}
            </span>
          </div>

          <Link
            to={`/destinations/${destination.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-2 rounded-xl transition-colors"
          >
            Explore
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
