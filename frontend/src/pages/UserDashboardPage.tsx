import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User as UserIcon,
  Bookmark,
  Calendar,
  Trash2,
  Edit3,
  MapPin,
  Sparkles,
  ExternalLink,
  LogOut,
  Clock,
  Compass,
  X,
  Check,
} from 'lucide-react';
import { Trip, Destination } from '../types';
import { tripService } from '../services/trip.service';
import { destinationService } from '../services/destination.service';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DestinationCard } from '../components/destination/DestinationCard';
import { EmptyState } from '../components/common/EmptyState';

export const UserDashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'trips';

  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [savedDestinations, setSavedDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal for Viewing Full Itinerary
  const [viewingTrip, setViewingTrip] = useState<Trip | null>(null);

  // Edit status state
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<'PLANNED' | 'COMPLETED' | 'CANCELLED'>('PLANNED');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripsData, savedData] = await Promise.all([
        tripService.getUserTrips(),
        destinationService.getSaved(),
      ]);
      setTrips(tripsData);
      setSavedDestinations(savedData);
    } catch (err: any) {
      toast(err.message || 'Failed to load user data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteTrip = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this trip itinerary?')) return;
    try {
      await tripService.delete(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      toast('Trip deleted successfully', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to delete trip', 'error');
    }
  };

  const handleUpdateTripStatus = async (tripId: string) => {
    try {
      const updated = await tripService.update(tripId, { status: newStatus });
      setTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, status: updated.status } : t)));
      setEditingTripId(null);
      toast(`Trip status updated to ${newStatus}`, 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to update trip status', 'error');
    }
  };

  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Profile Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-sky-500/20 shadow-md"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl font-black text-navy-900">{user?.name}</h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-700">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">{user?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-600">
              <span>{trips.length} Saved Trips</span>
              <span>•</span>
              <span>{savedDestinations.length} Wishlist Places</span>
            </div>
          </div>
        </div>

        <Link
          to="/ai-planner"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center gap-1.5 transition-all hover:scale-105 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Plan New AI Trip
        </Link>
      </div>

      {/* 2. Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setTab('trips')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            currentTab === 'trips'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Saved Trips ({trips.length})
        </button>

        <button
          onClick={() => setTab('saved')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            currentTab === 'saved'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved Wishlist ({savedDestinations.length})
        </button>

        <button
          onClick={() => setTab('settings')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            currentTab === 'settings'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          Account
        </button>
      </div>

      {/* 3. Tab Contents */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading your travel records...</p>
        </div>
      ) : currentTab === 'trips' ? (
        trips.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Saved Trips Yet"
            description="Use our AI Trip Planner to craft a personalized schedule and save it directly to your dashboard."
            actionText="Launch AI Planner"
            actionLink="/ai-planner"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        trip.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : trip.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {trip.status}
                    </span>

                    <span className="text-[11px] font-semibold text-slate-400">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-navy-900 mb-1 line-clamp-1">{trip.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    {trip.destination}
                  </p>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 text-xs mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Travelers</span>
                      <span className="font-bold text-slate-800">{trip.travelers} Guest(s)</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Budget</span>
                      <span className="font-bold text-navy-900">{formatCurrency(trip.budget)}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Status Row (if active) */}
                {editingTripId === trip.id ? (
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="text-xs font-bold border rounded-lg p-1.5 flex-1"
                    >
                      <option value="PLANNED">PLANNED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <button
                      onClick={() => handleUpdateTripStatus(trip.id)}
                      className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingTripId(null)}
                      className="p-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setViewingTrip(trip)}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                    >
                      View Details
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingTripId(trip.id);
                          setNewStatus(trip.status);
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Update status"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : currentTab === 'saved' ? (
        savedDestinations.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No Saved Wishlist Destinations"
            description="Browse popular destinations and tap the heart icon on any card to save it here."
            actionText="Explore Destinations"
            actionLink="/destinations"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDestinations.map((d) => (
              <DestinationCard
                key={d.id}
                destination={d}
                onSavedChange={(id, isSaved) => {
                  if (!isSaved) {
                    setSavedDestinations((prev) => prev.filter((item) => item.id !== id));
                  }
                }}
              />
            ))}
          </div>
        )
      ) : (
        /* Account Settings Tab */
        <div className="max-w-xl bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-navy-900">Account Profile</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between">
              <span className="font-medium text-slate-500">Name:</span>
              <span className="font-bold text-navy-900">{user?.name}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between">
              <span className="font-medium text-slate-500">Email:</span>
              <span className="font-bold text-navy-900">{user?.email}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between">
              <span className="font-medium text-slate-500">Account Role:</span>
              <span className="font-bold text-sky-600">{user?.role}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between">
              <span className="font-medium text-slate-500">Member Since:</span>
              <span className="font-bold text-slate-800">
                {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-rose-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out of TravelAI
          </button>
        </div>
      )}

      {/* Itinerary Details Modal */}
      {viewingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[85vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setViewingTrip(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block mb-1">
                Saved Itinerary
              </span>
              <h3 className="text-2xl font-black text-navy-900">{viewingTrip.title}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {viewingTrip.destination} • {formatDate(viewingTrip.startDate)} to {formatDate(viewingTrip.endDate)}
              </p>
            </div>

            {/* Overview */}
            {viewingTrip.itinerary?.tripSummary?.overview && (
              <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl leading-relaxed">
                {viewingTrip.itinerary.tripSummary.overview}
              </p>
            )}

            {/* Days list */}
            {viewingTrip.itinerary?.days && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-navy-900">Day-by-Day Schedule</h4>
                {viewingTrip.itinerary.days.map((day: any) => (
                  <div key={day.day} className="p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-navy-900">{day.title}</span>
                      <span className="font-bold text-sky-600">{formatCurrency(day.dailyTotalCostInr)}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-2">
                      <div className="bg-amber-50 p-2.5 rounded-xl">
                        <strong className="text-amber-800 block mb-0.5">Morning:</strong>
                        {day.morning?.activity}
                      </div>
                      <div className="bg-sky-50 p-2.5 rounded-xl">
                        <strong className="text-sky-800 block mb-0.5">Afternoon:</strong>
                        {day.afternoon?.activity}
                      </div>
                      <div className="bg-indigo-50 p-2.5 rounded-xl">
                        <strong className="text-indigo-800 block mb-0.5">Evening:</strong>
                        {day.evening?.activity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
