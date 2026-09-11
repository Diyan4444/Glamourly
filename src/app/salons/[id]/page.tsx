"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Star,
  Clock,
  Calendar,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import ReviewModal from "@/components/ReviewModal";
import { MockSalon } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

export default function SalonDetailPage() {
  const params = useParams();
  const salonId = params?.id as string;

  const [salon, setSalon] = useState<MockSalon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"services" | "staff" | "about" | "reviews">("services");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const fetchSalonDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/salons/${salonId}`);
      const data = await res.json();
      if (data.success) {
        setSalon(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [salonId]);

  useEffect(() => {
    if (salonId) {
      fetchSalonDetails();
    }
  }, [salonId, fetchSalonDetails]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-stone-600">Loading salon details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center max-w-md space-y-4">
            <h2 className="font-serif text-xl font-bold text-stone-900">Salon Not Found</h2>
            <p className="text-xs text-stone-500">
              The salon you are looking for might have been moved or is currently undergoing verification.
            </p>
            <Link
              href="/salons"
              className="inline-block bg-rose-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
            >
              Browse All Salons
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const serviceCategories = ["All", ...Array.from(new Set(salon.services.map((s) => s.category)))];

  const filteredServices =
    activeCategory === "All"
      ? salon.services
      : salon.services.filter((s) => s.category === activeCategory);

  const lowestPrice = salon.services.length
    ? Math.min(...salon.services.map((s) => s.price))
    : 499;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/salons" className="hover:text-stone-900">Mumbai Salons</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-800 font-semibold truncate">{salon.name}</span>
        </div>

        {/* HERO GALLERY & OVERVIEW */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 mb-8 space-y-6">
          {/* Gallery Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl overflow-hidden max-h-[380px]">
            <div className="md:col-span-2 h-72 md:h-full relative overflow-hidden bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={salon.coverImage}
                alt={salon.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              {salon.isVerified && (
                <div className="absolute top-4 left-4 bg-emerald-600/95 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <ShieldCheck className="w-4 h-4" /> Verified Salon
                </div>
              )}
            </div>

            <div className="hidden md:grid grid-rows-2 gap-4">
              {salon.images.slice(1, 3).map((img, idx) => (
                <div key={idx} className="h-full relative overflow-hidden bg-stone-100 rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${salon.name} interior`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Salon Header Info */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  {salon.name}
                </h1>
                {salon.isVerified && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Licensed & Verified
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-stone-500 font-medium">{salon.tagline}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                <span className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  {salon.address}, {salon.area}, Mumbai
                </span>

                <span className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/60 px-2.5 py-1 rounded-lg font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {salon.rating} ({salon.reviewCount} customer reviews)
                </span>
              </div>
            </div>

            {/* DIRECT PROVIDER CONTACT BOX */}
            <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 lg:w-96">
              <div className="space-y-1 flex-1 text-center sm:text-left">
                <span className="text-[11px] uppercase tracking-wider font-bold text-rose-800 flex items-center gap-1 justify-center sm:justify-start">
                  <Phone className="w-3.5 h-3.5" /> Direct Salon Contact
                </span>
                <p className="text-xs text-stone-600 leading-tight">
                  Have doubts about custom styling or timing? Contact the owner directly:
                </p>
                <a
                  href={`tel:${salon.contactPhone}`}
                  className="text-sm font-bold text-rose-700 hover:underline block pt-0.5"
                >
                  {salon.contactPhone}
                </a>
              </div>

              {salon.whatsappNumber && (
                <a
                  href={`https://wa.me/${salon.whatsappNumber}?text=Hi%20${encodeURIComponent(
                    salon.name
                  )},%20I%20am%20viewing%20your%20salon%20on%20Glamourly%20and%20have%20a%20query.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        {/* MAIN BODY: TABS + BOOKING SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: TABS & CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab navigation buttons */}
            <div className="bg-white rounded-2xl p-1.5 border border-stone-200 flex space-x-1">
              <button
                onClick={() => setActiveTab("services")}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === "services"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                Services Menu ({salon.services.length})
              </button>
              <button
                onClick={() => setActiveTab("staff")}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === "staff"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                Stylists & Staff ({salon.staff.length})
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === "about"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                Hours & Info
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === "reviews"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                Reviews ({salon.reviews.length})
              </button>
            </div>

            {/* TAB 1: SERVICES MENU */}
            {activeTab === "services" && (
              <div className="space-y-4">
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {serviceCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                        activeCategory === cat
                          ? "bg-stone-900 text-white shadow-xs"
                          : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Services List */}
                <div className="space-y-3">
                  {filteredServices.map((srv) => (
                    <div
                      key={srv.id}
                      className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-rose-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-md">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-base font-bold text-stone-900">
                            {srv.name}
                          </h4>
                          <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100">
                            {srv.category}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed">
                          {srv.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-stone-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" /> {srv.durationMinutes} mins
                          </span>
                          <span>•</span>
                          <span>{srv.gender}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                        <span className="text-base font-bold text-stone-900">
                          {formatPrice(srv.price)}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedServiceId(srv.id);
                            setIsBookingOpen(true);
                          }}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1"
                        >
                          <span>Book Service</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: STAFF / STYLIST TEAM */}
            {activeTab === "staff" && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Meet the Styling & Wellness Team
                  </h3>
                  <p className="text-xs text-stone-500">
                    Experienced certified professionals ready to craft your look.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {salon.staff.map((st) => (
                    <div
                      key={st.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex items-start gap-3.5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-rose-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-stone-900">{st.name}</h4>
                        <p className="text-xs text-rose-700 font-semibold">{st.role}</p>
                        <p className="text-[11px] text-stone-500">{st.experience}</p>
                        <div className="pt-1 flex flex-wrap gap-1">
                          {st.workingDays.map((d) => (
                            <span
                              key={d}
                              className="text-[9px] bg-white border border-stone-200 text-stone-600 px-1.5 py-0.5 rounded"
                            >
                              {d.slice(0, 3)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ABOUT & OPERATING HOURS */}
            {activeTab === "about" && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">About {salon.name}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed mt-2">{salon.description}</p>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <h4 className="font-serif text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-rose-600" />
                    Weekly Operating Hours
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {salon.operatingHours.map((h) => (
                      <div
                        key={h.day}
                        className="flex justify-between items-center p-2.5 rounded-xl bg-stone-50 border border-stone-100"
                      >
                        <span className="font-semibold text-stone-800">{h.day}</span>
                        {h.isClosed ? (
                          <span className="text-rose-600 font-bold">Closed</span>
                        ) : (
                          <span className="text-stone-600">
                            {h.open} - {h.close}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification License Safety */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-900 block">
                      Glamourly Verified Establishment
                    </span>
                    <span className="text-emerald-800">
                      License ID: {salon.businessLicenseNumber || "MH-MUM-EST-VERIFIED"} • Audited for Hygiene & Standards.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS */}
            {activeTab === "reviews" && (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">Customer Feedback</h3>
                    <p className="text-xs text-stone-500">
                      Overall rating: {salon.rating} / 5.0 from {salon.reviewCount} reviews
                    </p>
                  </div>

                  <button
                    onClick={() => setIsReviewOpen(true)}
                    className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
                  >
                    Write a Review
                  </button>
                </div>

                <div className="space-y-3">
                  {salon.reviews.length === 0 ? (
                    <p className="text-xs text-stone-400 py-6 text-center">
                      No reviews posted yet. Be the first to share your experience!
                    </p>
                  ) : (
                    salon.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-900">{rev.userName}</span>
                            {rev.verifiedBooking && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-medium">
                                Verified Customer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400">{rev.date}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>

                        <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: INSTANT BOOKING SIDEBAR CARD */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-lg sticky top-24 space-y-6">
              <div>
                <span className="text-[11px] text-stone-400 uppercase tracking-wider font-bold">
                  Instant Reservation
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-stone-900">
                    {formatPrice(lowestPrice)}
                  </span>
                  <span className="text-xs text-stone-500">starting price</span>
                </div>
              </div>

              <div className="space-y-3 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Live Slots:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Available Today
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Payment:</span>
                  <span className="font-semibold text-stone-800">Pay at Salon or Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Cancellation:</span>
                  <span className="font-semibold text-stone-800">Free before 2 hrs</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedServiceId(undefined);
                  setIsBookingOpen(true);
                }}
                className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Appointment Slot</span>
              </button>

              {/* Provider direct contact box in sidebar */}
              <div className="pt-4 border-t border-stone-100 text-center space-y-1">
                <span className="text-[11px] text-stone-500 block">Need assistance?</span>
                <a
                  href={`tel:${salon.contactPhone}`}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center justify-center gap-1"
                >
                  <Phone className="w-3 h-3" /> Call {salon.contactPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        salon={salon}
        isOpen={isBookingOpen}
        preSelectedServiceId={selectedServiceId}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Review Modal */}
      <ReviewModal
        salonId={salon.id}
        salonName={salon.name}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSuccess={fetchSalonDetails}
      />
    </div>
  );
}
