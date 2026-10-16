import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Hotel } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-black/20" />

        {/* Rating Badge */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 border border-white/10 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>{hotel.rating.toFixed(1)}</span>
        </div>

        {/* Destination Tag */}
        {hotel.destination && (
          <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 text-xs font-semibold text-white bg-sky-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <MapPin className="w-3 h-3 text-sky-400" />
            <span>{hotel.destination.city}, {hotel.destination.country}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-navy-900 group-hover:text-sky-600 transition-colors line-clamp-1 mb-1">
            {hotel.name}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mb-3 line-clamp-1">
            <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
            <span>{hotel.address}</span>
          </p>

          {/* Amenities Chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md"
              >
                <Check className="w-2.5 h-2.5 text-emerald-600" />
                {amenity}
              </span>
            ))}
            {hotel.amenities && hotel.amenities.length > 3 && (
              <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                +{hotel.amenities.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Price & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-sm font-extrabold text-navy-900">
              {formatCurrency(hotel.pricePerNight)}
            </span>
            <span className="text-xs text-slate-400 font-normal"> / night</span>
          </div>

          <Link
            to={`/hotels/${hotel.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-3.5 py-2 rounded-xl transition-all shadow-sm hover:shadow"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
