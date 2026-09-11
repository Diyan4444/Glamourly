"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Star,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewModal from "@/components/ReviewModal";
import { MockBooking } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<MockBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<MockBooking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-600 font-semibold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              My Appointments & Passes
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Manage your reserved salon slots and get direct contact details for your stylist.
            </p>
          </div>

          <Link
            href="/salons"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-2 w-fit"
          >
            <span>Book New Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-stone-200 animate-pulse rounded-3xl border" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-4 shadow-sm">
            <Calendar className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-stone-900">No Appointments Yet</h3>
            <p className="text-xs text-stone-500">
              You haven&apos;t booked any salon appointments. Explore top-rated Mumbai salons and reserve your slot today!
            </p>
            <Link
              href="/salons"
              className="inline-block bg-rose-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl"
            >
              Explore Salons
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Top Card Bar */}
                <div className="bg-stone-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-400/30 flex items-center justify-center text-rose-300 font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-white">
                        {booking.salonName}
                      </h3>
                      <p className="text-xs text-rose-200/80 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        {booking.salonAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-stone-800 text-amber-300 px-2.5 py-1 rounded-lg">
                      {booking.id}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        booking.status === "confirmed"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : booking.status === "completed"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-stone-700 text-stone-300"
                      }`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Service & Time */}
                  <div className="space-y-2 text-xs">
                    <span className="text-stone-400 uppercase tracking-wider font-bold">
                      Appointment Details
                    </span>
                    <p className="text-sm font-bold text-stone-900">{booking.serviceName}</p>
                    <p className="text-stone-600 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      {booking.date} at {booking.timeSlot}
                    </p>
                    <p className="text-stone-500">Stylist: {booking.staffName}</p>
                    {booking.notes && (
                      <p className="text-[11px] text-stone-400 italic">Notes: &quot;{booking.notes}&quot;</p>
                    )}
                  </div>

                  {/* Payment */}
                  <div className="space-y-2 text-xs">
                    <span className="text-stone-400 uppercase tracking-wider font-bold">
                      Payment Status
                    </span>
                    <p className="text-base font-bold text-stone-900">
                      {formatPrice(booking.price)}
                    </p>
                    <p className="text-emerald-700 font-semibold">{booking.paymentMethod}</p>
                    <span className="text-[11px] text-stone-400">
                      Reserved by: {booking.customerName}
                    </span>
                  </div>

                  {/* DIRECT PROVIDER CONTACT & DOUBT RESOLUTION */}
                  <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-100 space-y-3">
                    <span className="text-[11px] font-bold text-rose-900 uppercase block">
                      Direct Salon Contact
                    </span>
                    <p className="text-xs text-stone-600 leading-tight">
                      For timing changes or questions, contact the salon provider directly:
                    </p>
                    <div className="flex flex-col gap-2 pt-1">
                      <a
                        href={`tel:${booking.salonPhone}`}
                        className="bg-white hover:bg-stone-50 border border-rose-200 text-rose-700 text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5 text-rose-600" />
                        Call {booking.salonPhone}
                      </a>
                      <a
                        href={`https://wa.me/${booking.salonPhone.replace(
                          /\D/g,
                          ""
                        )}?text=Hi%20${encodeURIComponent(
                          booking.salonName
                        )},%20I%20have%20an%20appointment%20(ID:%20${booking.id})%20on%20${
                          booking.date
                        }%20at%20${booking.timeSlot}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp Salon
                      </a>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-xs text-stone-500">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-3">
                    {booking.status === "completed" && (
                      <button
                        onClick={() => {
                          setSelectedBookingForReview(booking);
                          setReviewModalOpen(true);
                        }}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        Rate Experience
                      </button>
                    )}

                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          salonId={selectedBookingForReview.salonId}
          salonName={selectedBookingForReview.salonName}
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedBookingForReview(null);
          }}
          onSuccess={fetchBookings}
        />
      )}
    </div>
  );
}
