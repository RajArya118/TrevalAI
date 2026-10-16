import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, Compass, MapPin } from 'lucide-react';
import { Destination, Pagination } from '../types';
import { destinationService } from '../services/destination.service';
import { DestinationCard } from '../components/destination/DestinationCard';
import { CardGridSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';

export const ExploreDestinationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 9, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filter States
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const maxBudget = searchParams.get('maxBudget') || '';

  const categories = ['All', 'Beach', 'Mountain', 'Heritage', 'Adventure', 'Nature', 'Urban'];

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await destinationService.getAll({
        search: search || undefined,
        category: category !== 'All' ? category : undefined,
        maxBudget: maxBudget ? parseFloat(maxBudget) : undefined,
        page,
        limit: 9,
      });
      setDestinations(res.destinations);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [search, category, page, maxBudget]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight mb-2">
          Explore Destinations
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Discover incredible places across India and worldwide. Filter by travel theme, search landmarks, or explore budget-friendly getaways.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-6 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/10">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search destination, city, or country..."
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Max Budget Filter */}
          <div className="md:col-span-4 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-400">Max Budget:</span>
            <select
              value={maxBudget}
              onChange={(e) => updateParam('maxBudget', e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="">Any Budget</option>
              <option value="15000">Under ₹15,000</option>
              <option value="25000">Under ₹25,000</option>
              <option value="50000">Under ₹50,000</option>
              <option value="80000">Under ₹80,000</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="w-full md:w-auto px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam('category', cat)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                category === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs font-bold text-slate-500">
        Showing {destinations.length} of {pagination.total} destinations
      </div>

      {/* Destination Grid */}
      {loading ? (
        <CardGridSkeleton count={9} />
      ) : destinations.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No destinations match your filters"
          description="Try loosening your search terms or selecting 'All Categories' to see more incredible places."
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
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
