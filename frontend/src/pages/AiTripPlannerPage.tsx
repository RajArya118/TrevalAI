import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Users,
  Wallet,
  Compass,
  MapPin,
  Check,
  Bookmark,
  Sun,
  Sunset,
  Moon,
  Utensils,
  Lightbulb,
  Building,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiItineraryResponse, DayItinerary } from '../types';
import { aiService, PlanTripAiPayload } from '../services/ai.service';
import { tripService } from '../services/trip.service';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { HotelCard } from '../components/hotel/HotelCard';

export const AiTripPlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Form State
  const initialDestination = searchParams.get('destination') || 'Goa';
  const [destination, setDestination] = useState(initialDestination);
  const [startDate, setStartDate] = useState('2026-11-10');
  const [endDate, setEndDate] = useState('2026-11-14');
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(30000);
  const [tripStyle, setTripStyle] = useState('relaxation');
  const [preferences, setPreferences] = useState('Beach relaxation, authentic seafood, and colonial heritage walks');

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<AiItineraryResponse | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [savingTrip, setSavingTrip] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const quickDestinations = ['Goa', 'Manali', 'Jaipur', 'Munnar', 'Bali', 'Rishikesh'];
  const styles = [
    { id: 'relaxation', label: 'Relaxation', desc: 'Beaches, spas, slow cafes' },
    { id: 'adventure', label: 'Adventure', desc: 'Treks, rafting, outdoor thrill' },
    { id: 'culture', label: 'Culture & Heritage', desc: 'Forts, temples, historic walks' },
    { id: 'family', label: 'Family Friendly', desc: 'Comfortable, scenic, all ages' },
    { id: 'food', label: 'Foodie Trail', desc: 'Street eats, fine cuisine, tastings' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      toast('Please enter a destination', 'error');
      return;
    }

    try {
      setGenerating(true);
      setSavedSuccess(false);
      const payload: PlanTripAiPayload = {
        destination,
        startDate,
        endDate,
        travelers,
        budget: Number(budget),
        tripStyle,
        preferences,
      };

      const result = await aiService.planTrip(payload);
      setItinerary(result);
      setSelectedDay(1);
      toast(
        result.isDemo
          ? 'Itinerary generated in Demo Mode'
          : 'Itinerary generated via Google Gemini API',
        'success'
      );
    } catch (err: any) {
      toast(err.message || 'Failed to generate itinerary', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveTripToDb = async () => {
    if (!itinerary) return;

    if (!isAuthenticated) {
      toast('Please sign in to save your trip itinerary to your dashboard', 'info');
      navigate('/login?redirect=/ai-planner');
      return;
    }

    try {
      setSavingTrip(true);
      await tripService.create({
        title: `${itinerary.tripSummary.durationDays}-Day ${itinerary.tripSummary.tripStyle.toUpperCase()} Trip to ${itinerary.tripSummary.destination}`,
        destination: itinerary.tripSummary.destination,
        startDate,
        endDate,
        travelers: itinerary.tripSummary.travelers,
        budget: itinerary.tripSummary.totalEstimatedBudgetInr,
        tripStyle: itinerary.tripSummary.tripStyle,
        preferences,
        itinerary,
        status: 'PLANNED',
        isAiGenerated: true,
      });

      setSavedSuccess(true);
      toast('Trip saved to your personal dashboard successfully!', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to save trip', 'error');
    } finally {
      setSavingTrip(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          Powered by Google Gemini AI & Heuristic Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-900 tracking-tight mb-4">
          Autonomous AI Trip Planner
        </h1>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
          Craft bespoke day-by-day itineraries tailored to your schedule, travelers, and budget in Indian Rupees. Complete with morning, afternoon, and evening activities and verified hotel pairings.
        </p>
      </div>

      {/* 1. Trip Planning Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xl max-w-4xl mx-auto">
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Destination */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Destination
            </label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/10">
              <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
              <input
                type="text"
                placeholder="e.g. Goa, Manali, Jaipur, Bali, Kyoto..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Quick Chips */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Popular:</span>
              {quickDestinations.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDestination(d)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                    destination.toLowerCase() === d.toLowerCase()
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Dates & Travelers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Start Date
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <Calendar className="w-4 h-4 text-sky-600" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                End Date
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <Calendar className="w-4 h-4 text-sky-600" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Travelers
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <Users className="w-4 h-4 text-sky-600" />
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value, 10))}
                  className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 Solo Explorer</option>
                  <option value={2}>2 Couple / Pair</option>
                  <option value={3}>3 Friends Group</option>
                  <option value={4}>4 Family / Group</option>
                  <option value={6}>6+ Large Group</option>
                </select>
              </div>
            </div>
          </div>

          {/* Budget in INR */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Budget (INR)
              </label>
              <span className="text-sm font-extrabold text-sky-600">
                {formatCurrency(budget)}
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-sky-500">
              <Wallet className="w-5 h-5 text-sky-600 shrink-0" />
              <input
                type="number"
                min="5000"
                step="1000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                required
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
              />
            </div>
            {/* Quick Budget Presets */}
            <div className="flex gap-2 mt-2">
              {[15000, 30000, 60000, 100000].map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setBudget(b)}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  {formatCurrency(b)}
                </button>
              ))}
            </div>
          </div>

          {/* Trip Style */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Travel Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {styles.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setTripStyle(s.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    tripStyle === s.id
                      ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-navy-900 mb-0.5">{s.label}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Preferences & Special Notes
            </label>
            <textarea
              rows={2}
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g. Vegetarian only, beachfront cafes, sunrise treks, slow mornings..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={generating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-sky-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Crafting Your Custom Itinerary...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Generate Smart Travel Itinerary</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 2. Generated Itinerary Results View */}
      {itinerary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Mode Indicator Banner */}
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-4 ${
              itinerary.isDemo
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {itinerary.isDemo ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              <span>
                <strong>{itinerary.isDemo ? 'Demo Mode Active:' : 'Live Gemini Model:'}</strong>{' '}
                {itinerary.demoReason || `Connected to ${itinerary.modelUsed}`}
              </span>
            </div>

            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/70 border shrink-0">
              {itinerary.isDemo ? 'Simulation' : 'Live AI'}
            </span>
          </div>

          {/* Trip Summary Card with Save Button */}
          <div className="bg-navy-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-sky-400 block mb-1">
                Your Customized Itinerary
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mb-2">
                {itinerary.tripSummary.durationDays}-Day {itinerary.tripSummary.tripStyle.toUpperCase()} Trip to {itinerary.tripSummary.destination}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {itinerary.tripSummary.overview}
              </p>
            </div>

            {/* Save Trip CTA */}
            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={handleSaveTripToDb}
                disabled={savingTrip || savedSuccess}
                className={`w-full md:w-auto px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                  savedSuccess
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-navy-900 hover:bg-slate-100 hover:scale-105'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved to My Trips</span>
                  </>
                ) : savingTrip ? (
                  <>
                    <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-sky-600" />
                    <span>Save Trip to Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Budget Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Stays</span>
              <span className="text-sm font-bold text-navy-900">
                {formatCurrency(itinerary.budgetBreakdown.accommodationInr)}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Activities</span>
              <span className="text-sm font-bold text-navy-900">
                {formatCurrency(itinerary.budgetBreakdown.activitiesInr)}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Food & Dining</span>
              <span className="text-sm font-bold text-navy-900">
                {formatCurrency(itinerary.budgetBreakdown.foodInr)}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Transport</span>
              <span className="text-sm font-bold text-navy-900">
                {formatCurrency(itinerary.budgetBreakdown.localTransportInr)}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Buffer</span>
              <span className="text-sm font-bold text-navy-900">
                {formatCurrency(itinerary.budgetBreakdown.contingencyInr)}
              </span>
            </div>
            <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200">
              <span className="text-[10px] uppercase font-bold text-sky-600 block">Estimated Total</span>
              <span className="text-sm font-black text-sky-700">
                {formatCurrency(itinerary.budgetBreakdown.grandTotalInr)}
              </span>
            </div>
          </div>

          {/* Day-by-Day Itinerary Schedule */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-navy-900">Day-by-Day Schedule</h3>

            {/* Day Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-100">
              {itinerary.days.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setSelectedDay(d.day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedDay === d.day
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Day {d.day}
                </button>
              ))}
            </div>

            {/* Selected Day Content */}
            {(() => {
              const currentDay = itinerary.days.find((d) => d.day === selectedDay) || itinerary.days[0];
              if (!currentDay) return null;

              return (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-lg font-bold text-navy-900">{currentDay.title}</h4>
                      <p className="text-xs text-sky-600 font-semibold">{currentDay.theme}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                      Day Budget: {formatCurrency(currentDay.dailyTotalCostInr)}
                    </span>
                  </div>

                  {/* Timeline Cards: Morning, Afternoon, Evening */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Morning */}
                    <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100/80 space-y-3">
                      <div className="flex items-center gap-2 text-amber-700">
                        <Sun className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Morning</span>
                      </div>
                      <h5 className="text-sm font-bold text-navy-900">{currentDay.morning.activity}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{currentDay.morning.description}</p>
                      <div className="pt-2 border-t border-amber-200/50 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>{currentDay.morning.location}</span>
                        <span className="text-amber-800 font-bold">{formatCurrency(currentDay.morning.estimatedCostInr)}</span>
                      </div>
                    </div>

                    {/* Afternoon */}
                    <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-100/80 space-y-3">
                      <div className="flex items-center gap-2 text-sky-700">
                        <Sunset className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Afternoon</span>
                      </div>
                      <h5 className="text-sm font-bold text-navy-900">{currentDay.afternoon.activity}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{currentDay.afternoon.description}</p>
                      <div className="pt-2 border-t border-sky-200/50 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>{currentDay.afternoon.location}</span>
                        <span className="text-sky-800 font-bold">{formatCurrency(currentDay.afternoon.estimatedCostInr)}</span>
                      </div>
                    </div>

                    {/* Evening */}
                    <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-3">
                      <div className="flex items-center gap-2 text-indigo-700">
                        <Moon className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Evening</span>
                      </div>
                      <h5 className="text-sm font-bold text-navy-900">{currentDay.evening.activity}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{currentDay.evening.description}</p>
                      <div className="pt-2 border-t border-indigo-200/50 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>{currentDay.evening.location}</span>
                        <span className="text-indigo-800 font-bold">{formatCurrency(currentDay.evening.estimatedCostInr)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Meals */}
                  {currentDay.meals && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-700">
                        <Utensils className="w-4 h-4 text-sky-600" />
                        <span>Dining Suggestions:</span>
                      </div>
                      <div className="text-slate-600 text-[11px] flex-1">
                        <strong>Breakfast:</strong> {currentDay.meals.breakfast} • <strong>Lunch:</strong> {currentDay.meals.lunch} • <strong>Dinner:</strong> {currentDay.meals.dinner}
                      </div>
                      <span className="font-bold text-navy-900">
                        ~{formatCurrency(currentDay.meals.estimatedTotalCostInr)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Travel Tips */}
          {itinerary.travelTips && itinerary.travelTips.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-3">
              <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Expert Travel Tips for {itinerary.tripSummary.destination}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                {itinerary.travelTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Hotels from Database */}
          {itinerary.suggestedHotelsFromDb && itinerary.suggestedHotelsFromDb.length > 0 && (
            <div className="space-y-6 pt-4">
              <div>
                <h3 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
                  <Building className="w-6 h-6 text-sky-600" />
                  Suggested Hotel Pairings
                </h3>
                <p className="text-xs text-slate-500">
                  Recommended stays from our verified PostgreSQL database matching this destination.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {itinerary.suggestedHotelsFromDb.map((hotel: any) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
