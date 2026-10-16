import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  Check,
  ChevronLeft,
  Calendar,
  Users,
  ShieldCheck,
  CreditCard,
  X,
} from 'lucide-react';
import { Hotel } from '../types';
import { hotelService } from '../services/hotel.service';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const HotelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking simulation state
  const [checkIn, setCheckIn] = useState('2026-11-15');
  const [checkOut, setCheckOut] = useState('2026-11-18');
  const [guests, setGuests] = useState(2);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    hotelService
      .getById(id)
      .then((data) => setHotel(data))
      .catch((err) => {
        console.error(err);
        toast('Hotel not found', 'error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    ) || 1
  );

  const totalPrice = hotel ? hotel.pricePerNight * nights : 0;
  const taxesAndFees = Math.round(totalPrice * 0.12);
  const grandTotal = totalPrice + taxesAndFees;

  const handleConfirmBooking = () => {
    setBookingSuccess(true);
    toast('Reservation inquiry confirmed! Check your email for details.', 'success');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading hotel details...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Hotel Not Found</h2>
        <Link to="/hotels" className="text-sky-600 font-semibold hover:underline">
          Return to Hotels
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/hotels"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Hotels
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column (2 Cols): Image, Details, Amenities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Image */}
          <div className="relative h-[380px] sm:h-[460px] rounded-3xl overflow-hidden bg-slate-100 shadow-md">
            <img
              src={hotel.imageUrl}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-amber-300">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>{hotel.rating.toFixed(1)} / 5.0</span>
            </div>
          </div>

          {/* Title & Address */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-2">
              {hotel.name}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
              {hotel.address}
              {hotel.destination && (
                <span>
                  •{' '}
                  <Link
                    to={`/destinations/${hotel.destination.id}`}
                    className="text-sky-600 font-semibold hover:underline"
                  >
                    {hotel.destination.name}
                  </Link>
                </span>
              )}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-navy-900">Featured Amenities & Services</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hotel.amenities?.map((amenity: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-700"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer Box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Booking Simulation Notice</span>
              Prices and availability shown are realistic estimates calculated in Indian Rupees (INR). Final room allocations are subject to direct hotel confirmation.
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Booking Widget Card */}
        <div>
          <div className="sticky top-24 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-2xl font-black text-navy-900">
                  {formatCurrency(hotel.pricePerNight)}
                </span>
                <span className="text-xs text-slate-400 font-normal"> / night</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{hotel.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-700">Guests:</span>
              </div>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                className="bg-transparent font-bold text-slate-800 focus:outline-none"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
              </select>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>
                  {formatCurrency(hotel.pricePerNight)} x {nights} nights
                </span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Service Fees (12%)</span>
                <span>{formatCurrency(taxesAndFees)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-navy-900 pt-2 border-t border-slate-100">
                <span>Total Due</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Booking CTA */}
            <button
              onClick={() => {
                setBookingSuccess(false);
                setBookingModalOpen(true);
              }}
              className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-lg shadow-sky-600/30 transition-all hover:scale-[1.02]"
            >
              Reserve Room
            </button>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Simulation Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingSuccess ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-navy-900">Confirm Reservation Simulation</h3>
                <p className="text-xs text-slate-500">
                  You are reserving <strong>{hotel.name}</strong> for {nights} night(s) from {checkIn} to {checkOut}.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Price:</span>
                    <span className="font-bold text-navy-900">{formatCurrency(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Guests:</span>
                    <span className="font-bold text-slate-800">{guests}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md"
                >
                  Confirm Reservation Simulation
                </button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-xl font-bold text-navy-900">Reservation Confirmed!</h3>
                <p className="text-xs text-slate-500">
                  Your reservation simulation has been recorded. This demonstration confirms seamless integration with the TravelAI platform.
                </p>
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="px-6 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs mt-2"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
