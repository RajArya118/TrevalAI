import React, { useEffect, useState } from 'react';
import {
  Users,
  Compass,
  Building,
  Calendar,
  Plus,
  Trash2,
  Edit,
  Shield,
  BarChart3,
  Search,
  Check,
  X,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AdminAnalytics, Destination, Hotel, User, Trip } from '../types';
import { adminService } from '../services/admin.service';
import { destinationService } from '../services/destination.service';
import { hotelService } from '../services/hotel.service';
import { tripService } from '../services/trip.service';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminDashboardPage: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'analytics' | 'destinations' | 'hotels' | 'users' | 'trips'>('analytics');
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Search in tabs
  const [destSearch, setDestSearch] = useState('');
  const [hotelSearch, setHotelSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Destination Modal (Create/Edit)
  const [destModalOpen, setDestModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [destForm, setDestForm] = useState({
    name: '',
    city: '',
    country: '',
    category: 'Beach',
    description: '',
    imageUrl: '',
    rating: 4.8,
    estimatedBudget: 20000,
    bestTimeToVisit: 'October to March',
    attractions: 'Main Beach, Historic Lighthouse, Local Market',
    featured: false,
  });

  // Hotel Modal (Create/Edit)
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [hotelForm, setHotelForm] = useState({
    name: '',
    destinationId: '',
    pricePerNight: 8000,
    rating: 4.6,
    address: '',
    imageUrl: '',
    amenities: 'Free WiFi, Swimming Pool, Free Breakfast, Ocean View',
    featured: false,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsData, destsData, hotelsData, usersData, tripsData] = await Promise.all([
        adminService.getAnalytics(),
        destinationService.getAll({ limit: 50 }),
        hotelService.getAll({ limit: 50 }),
        adminService.getUsers(1, 50),
        tripService.getAllForAdmin(1, 50),
      ]);
      setAnalytics(analyticsData);
      setDestinations(destsData.destinations);
      setHotels(hotelsData.hotels);
      setUsers(usersData.users);
      setTrips(tripsData.trips);
    } catch (err: any) {
      toast(err.message || 'Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Destination CRUD Actions
  const handleOpenDestModal = (dest?: Destination) => {
    if (dest) {
      setEditingDest(dest);
      setDestForm({
        name: dest.name,
        city: dest.city,
        country: dest.country,
        category: dest.category,
        description: dest.description,
        imageUrl: dest.imageUrl,
        rating: dest.rating,
        estimatedBudget: dest.estimatedBudget,
        bestTimeToVisit: dest.bestTimeToVisit,
        attractions: dest.attractions.join(', '),
        featured: dest.featured,
      });
    } else {
      setEditingDest(null);
      setDestForm({
        name: '',
        city: '',
        country: '',
        category: 'Beach',
        description: '',
        imageUrl: '',
        rating: 4.8,
        estimatedBudget: 20000,
        bestTimeToVisit: 'October to March',
        attractions: 'Main Beach, Historic Fort, Night Market',
        featured: false,
      });
    }
    setDestModalOpen(true);
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...destForm,
        rating: Number(destForm.rating),
        estimatedBudget: Number(destForm.estimatedBudget),
        attractions: destForm.attractions.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingDest) {
        const updated = await destinationService.update(editingDest.id, payload);
        setDestinations((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
        toast('Destination updated successfully', 'success');
      } else {
        const created = await destinationService.create(payload);
        setDestinations((prev) => [created, ...prev]);
        toast('Destination created successfully', 'success');
      }
      setDestModalOpen(false);
    } catch (err: any) {
      toast(err.message || 'Failed to save destination', 'error');
    }
  };

  const handleDeleteDestination = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this destination? Linked hotels may also be removed.')) return;
    try {
      await destinationService.delete(id);
      setDestinations((prev) => prev.filter((d) => d.id !== id));
      toast('Destination removed', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to delete destination', 'error');
    }
  };

  // Hotel CRUD Actions
  const handleOpenHotelModal = (hotel?: Hotel) => {
    if (hotel) {
      setEditingHotel(hotel);
      setHotelForm({
        name: hotel.name,
        destinationId: hotel.destinationId,
        pricePerNight: hotel.pricePerNight,
        rating: hotel.rating,
        address: hotel.address,
        imageUrl: hotel.imageUrl,
        amenities: hotel.amenities.join(', '),
        featured: hotel.featured,
      });
    } else {
      setEditingHotel(null);
      setHotelForm({
        name: '',
        destinationId: destinations[0]?.id || '',
        pricePerNight: 8000,
        rating: 4.6,
        address: '',
        imageUrl: '',
        amenities: 'Free WiFi, Swimming Pool, Free Breakfast, Ocean View',
        featured: false,
      });
    }
    setHotelModalOpen(true);
  };

  const handleSaveHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...hotelForm,
        pricePerNight: Number(hotelForm.pricePerNight),
        rating: Number(hotelForm.rating),
        amenities: hotelForm.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingHotel) {
        const updated = await hotelService.update(editingHotel.id, payload);
        setHotels((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
        toast('Hotel updated successfully', 'success');
      } else {
        const created = await hotelService.create(payload);
        setHotels((prev) => [created, ...prev]);
        toast('Hotel created successfully', 'success');
      }
      setHotelModalOpen(false);
    } catch (err: any) {
      toast(err.message || 'Failed to save hotel', 'error');
    }
  };

  const handleDeleteHotel = async (id: string) => {
    if (!window.confirm('Delete this hotel record?')) return;
    try {
      await hotelService.delete(id);
      setHotels((prev) => prev.filter((h) => h.id !== id));
      toast('Hotel deleted', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to delete hotel', 'error');
    }
  };

  // User Management
  const handleToggleUserRole = async (targetUser: User) => {
    const nextRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await adminService.updateUserRole(targetUser.id, nextRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: nextRole } : u))
      );
      toast(`User role updated to ${nextRole}`, 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to update user role', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast('User deleted', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to delete user', 'error');
    }
  };

  const COLORS = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Admin Header Banner */}
      <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-amber-400" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
              Admin Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">TravelAI Administration</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time PostgreSQL metrics, database CRUD, and user oversight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenDestModal()}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Destination
          </button>
          <button
            onClick={() => handleOpenHotelModal()}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Hotel
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Total Users</span>
              <span className="text-2xl font-black text-navy-900">{analytics.overview.totalUsers}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Destinations</span>
              <span className="text-2xl font-black text-navy-900">{analytics.overview.totalDestinations}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Verified Hotels</span>
              <span className="text-2xl font-black text-navy-900">{analytics.overview.totalHotels}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Saved Trips</span>
              <span className="text-2xl font-black text-navy-900">{analytics.overview.totalTrips}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analytics & Trends
        </button>

        <button
          onClick={() => setActiveTab('destinations')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'destinations'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          Destinations ({destinations.length})
        </button>

        <button
          onClick={() => setActiveTab('hotels')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'hotels'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          Hotels ({hotels.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Users ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('trips')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'trips'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Trips Oversight ({trips.length})
        </button>
      </div>

      {/* 4. Tab Views */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Querying PostgreSQL database...</p>
        </div>
      ) : activeTab === 'analytics' && analytics ? (
        <div className="space-y-8">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trips Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                Monthly Trip Creation Trend
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.charts.monthlyTripsTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="trips" stroke="#0284c7" fill="#e0f2fe" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Destinations by Category Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                Destinations Distribution by Category
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.charts.destinationsByCategory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Signups */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-navy-900">Recent Registered Users</h3>
              <div className="space-y-3">
                {analytics.recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-xs">
                    <div>
                      <span className="font-bold text-navy-900 block">{u.name}</span>
                      <span className="text-slate-400">{u.email}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Rated Destinations */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-navy-900">Top Rated Destinations</h3>
              <div className="space-y-3">
                {analytics.topDestinations.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-xs">
                    <div>
                      <span className="font-bold text-navy-900 block">{d.name}</span>
                      <span className="text-slate-400">{d.city}, {d.country}</span>
                    </div>
                    <span className="font-black text-amber-500">★ {d.rating.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'destinations' ? (
        /* Destinations Table */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search destination table..."
                value={destSearch}
                onChange={(e) => setDestSearch(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>

            <button
              onClick={() => handleOpenDestModal()}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              New Destination
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {destinations
                  .filter((d) => d.name.toLowerCase().includes(destSearch.toLowerCase()))
                  .map((dest) => (
                    <tr key={dest.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={dest.imageUrl}
                            alt={dest.name}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div>
                            <span className="font-bold text-navy-900 block">{dest.name}</span>
                            <span className="text-[11px] text-slate-400">{dest.city}, {dest.country}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{dest.category}</td>
                      <td className="p-4 font-bold text-navy-900">{formatCurrency(dest.estimatedBudget)}</td>
                      <td className="p-4 font-bold text-amber-500">★ {dest.rating.toFixed(1)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenDestModal(dest)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDestination(dest.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'hotels' ? (
        /* Hotels Table */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search hotels table..."
                value={hotelSearch}
                onChange={(e) => setHotelSearch(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>

            <button
              onClick={() => handleOpenHotelModal()}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              New Hotel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4">Hotel</th>
                  <th className="p-4">Price / Night</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Address</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hotels
                  .filter((h) => h.name.toLowerCase().includes(hotelSearch.toLowerCase()))
                  .map((hotel) => (
                    <tr key={hotel.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={hotel.imageUrl}
                            alt={hotel.name}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div>
                            <span className="font-bold text-navy-900 block">{hotel.name}</span>
                            <span className="text-[11px] text-slate-400">{hotel.destination?.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-navy-900">{formatCurrency(hotel.pricePerNight)}</td>
                      <td className="p-4 font-bold text-amber-500">★ {hotel.rating.toFixed(1)}</td>
                      <td className="p-4 text-slate-500 truncate max-w-[200px]">{hotel.address}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenHotelModal(hotel)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteHotel(hotel.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'users' ? (
        /* Users Table */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4 text-right">Role / Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users
                  .filter((u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.includes(userSearch))
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <span className="font-bold text-navy-900 block">{u.name}</span>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{formatDate(u.createdAt)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleUserRole(u)}
                            className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold hover:bg-slate-50"
                          >
                            Toggle Role
                          </button>
                          {u.id !== currentAdmin?.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Trips Oversight Table */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4">Trip Title</th>
                  <th className="p-4">Traveler</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Dates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trips.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-navy-900">{t.title}</td>
                    <td className="p-4 text-slate-600">{t.user?.name || 'User'}</td>
                    <td className="p-4 text-slate-600">{t.destination}</td>
                    <td className="p-4 font-bold text-navy-900">{formatCurrency(t.budget)}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{formatDate(t.startDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Destination Modal (Add/Edit) */}
      {destModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-4">
            <button
              onClick={() => setDestModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-navy-900">
              {editingDest ? 'Edit Destination' : 'Add New Destination'}
            </h3>

            <form onSubmit={handleSaveDestination} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={destForm.name}
                  onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={destForm.city}
                    onChange={(e) => setDestForm({ ...destForm, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={destForm.country}
                    onChange={(e) => setDestForm({ ...destForm, country: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={destForm.category}
                    onChange={(e) => setDestForm({ ...destForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="Beach">Beach</option>
                    <option value="Mountain">Mountain</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Nature">Nature</option>
                    <option value="Urban">Urban</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Est. Budget (INR)</label>
                  <input
                    type="number"
                    required
                    value={destForm.estimatedBudget}
                    onChange={(e) => setDestForm({ ...destForm, estimatedBudget: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={destForm.imageUrl}
                  onChange={(e) => setDestForm({ ...destForm, imageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={destForm.description}
                  onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Attractions (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={destForm.attractions}
                  onChange={(e) => setDestForm({ ...destForm, attractions: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredDest"
                  checked={destForm.featured}
                  onChange={(e) => setDestForm({ ...destForm, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featuredDest" className="font-semibold text-slate-700 cursor-pointer">
                  Featured on Homepage
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md mt-4"
              >
                {editingDest ? 'Update Destination' : 'Save Destination'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hotel Modal (Add/Edit) */}
      {hotelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-4">
            <button
              onClick={() => setHotelModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-navy-900">
              {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
            </h3>

            <form onSubmit={handleSaveHotel} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Hotel Name</label>
                <input
                  type="text"
                  required
                  value={hotelForm.name}
                  onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Destination</label>
                  <select
                    value={hotelForm.destinationId}
                    onChange={(e) => setHotelForm({ ...hotelForm, destinationId: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.city})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Price / Night (INR)</label>
                  <input
                    type="number"
                    required
                    value={hotelForm.pricePerNight}
                    onChange={(e) => setHotelForm({ ...hotelForm, pricePerNight: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={hotelForm.address}
                  onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={hotelForm.imageUrl}
                  onChange={(e) => setHotelForm({ ...hotelForm, imageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={hotelForm.amenities}
                  onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredHotel"
                  checked={hotelForm.featured}
                  onChange={(e) => setHotelForm({ ...hotelForm, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featuredHotel" className="font-semibold text-slate-700 cursor-pointer">
                  Featured on Homepage
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md mt-4"
              >
                {editingHotel ? 'Update Hotel' : 'Save Hotel'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
