import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Building, RotateCcw, Star } from 'lucide-react';
import { Hotel, Pagination } from '../types';
import { hotelService } from '../services/hotel.service';
import { HotelCard } from '../components/hotel/HotelCard';
import { CardGridSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';

export const HotelListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 8, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const destinationId = searchParams.get('destinationId') || '';
  const minRating = searchParams.get('minRating') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await hotelService.getAll({
        search: search || undefined,
        destinationId: destinationId || undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        page,
        limit: 8,
      });
      setHotels(res.hotels);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [search, destinationId, minRating, maxPrice, page]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight mb-2">
          Hotels & Stays
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Browse luxury beach resorts, serene alpine chalets, royal havelis, and boutique city hotels with transparent INR pricing.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="lg:col-span-5 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-sky-500">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search hotel name, location, or address..."
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Rating Filter */}
          <div className="lg:col-span-3 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
            <select
              value={minRating}
              onChange={(e) => updateParam('minRating', e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Exceptional</option>
              <option value="4.0">4.0+ Very Good</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="lg:col-span-3 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-400">Max / Night:</span>
            <select
              value={maxPrice}
              onChange={(e) => updateParam('maxPrice', e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="">Any Price</option>
              <option value="5000">Under ₹5,000</option>
              <option value="10000">Under ₹10,000</option>
              <option value="20000">Under ₹20,000</option>
              <option value="40000">Under ₹40,000</option>
            </select>
          </div>

          {/* Reset */}
          <div className="lg:col-span-1 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="w-full p-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              title="Reset filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-xs font-bold text-slate-500">
        Showing {hotels.length} of {pagination.total} hotels
      </div>

      {/* Grid */}
      {loading ? (
        <CardGridSkeleton count={8} />
      ) : hotels.length === 0 ? (
        <EmptyState
          icon={Building}
          title="No hotels found matching criteria"
          description="Try broadening your search term or adjusting your price filters."
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('page', Math.max(1, page - 1).toString());
              setSearchParams(newParams);
            }}
            disabled={page <= 1}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs font-bold text-slate-600 px-3">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('page', Math.min(pagination.totalPages, page + 1).toString());
              setSearchParams(newParams);
            }}
            disabled={page >= pagination.totalPages}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
