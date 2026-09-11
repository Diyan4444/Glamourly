"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  MapPin,
  ShieldCheck,
  Calendar,
  Phone,
  ArrowRight,
  Scissors,
  Eye,
  Smile,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SalonCard from "@/components/SalonCard";
import BookingModal from "@/components/BookingModal";
import { MockSalon } from "@/lib/mockData";

export default function HomePage() {
  const [salons, setSalons] = useState<MockSalon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("All");
  const [bookingSalon, setBookingSalon] = useState<MockSalon | null>(null);

  const mumbaiLocalities = [
    "All",
    "Bandra West",
    "Juhu",
    "Colaba",
    "Andheri West",
    "Powai",
    "Worli",
    "Lower Parel",
  ];

  const popularCategories = [
    { name: "Hair Styling & Cuts", icon: Scissors, count: "45+ Salons", query: "Hair" },
    { name: "Facials & Skincare", icon: Smile, count: "38+ Salons", query: "Facial" },
    { name: "Bridal & Glamour", icon: Sparkles, count: "25+ Studios", query: "Bridal" },
    { name: "Nails & Lash Bar", icon: Eye, count: "30+ Studios", query: "Nails" },
    { name: "Spa & Body Massage", icon: Zap, count: "20+ Retreats", query: "Spa" },
  ];

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      const res = await fetch("/api/salons");
      const data = await res.json();
      if (data.success) {
        setSalons(data.data);
      }
    } catch (e) {
      console.error("Failed to load salons", e);
    }
  };

  const filteredSalons = salons.filter((salon) => {
    const matchesArea = selectedArea === "All" || salon.area.toLowerCase() === selectedArea.toLowerCase();
    const matchesQuery =
      searchQuery === "" ||
      salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.services.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesArea && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-rose-950 to-stone-950 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs px-4 py-1.5 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mumbai&apos;s Curated Luxury Salon Marketplace</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-100 max-w-4xl mx-auto leading-tight">
            Indulge in <span className="italic font-normal text-rose-300">Exquisite</span> Salon & Spa Experiences
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            Discover verified premium salons in Bandra, Juhu, Colaba, and beyond. Compare treatments, transparent prices, and reserve instant stylist slots.
          </p>

          {/* Search Box */}
          <div className="bg-white/95 backdrop-blur-md p-2 sm:p-3 rounded-3xl shadow-2xl max-w-3xl mx-auto border border-white/20 mt-8 text-stone-900">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 w-full flex-1 border-b sm:border-b-0 sm:border-r border-stone-200">
                <Search className="w-5 h-5 text-rose-600 shrink-0" />
                <input
                  type="text"
                  placeholder="Search hair spa, balayage, facial, keratin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none text-stone-900 placeholder:text-stone-400"
                />
              </div>

              <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-auto">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-medium text-stone-800 focus:outline-none cursor-pointer pr-4"
                >
                  {mumbaiLocalities.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc === "All" ? "All Mumbai Localities" : loc}
                    </option>
                  ))}
                </select>
              </div>

              <Link
                href={`/salons?q=${encodeURIComponent(searchQuery)}&area=${encodeURIComponent(
                  selectedArea === "All" ? "" : selectedArea
                )}`}
                className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Find Salons</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 max-w-xl mx-auto pt-6 text-center text-xs text-rose-200/90 gap-4">
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-white">100%</span>
              <span className="text-[11px] text-stone-400">Verified Salons</span>
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-white">₹0 Fee</span>
              <span className="text-[11px] text-stone-400">Pay at Venue Option</span>
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-white">Direct</span>
              <span className="text-[11px] text-stone-400">Provider Phone Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-200/80">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {popularCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/salons?category=${encodeURIComponent(cat.query)}`}
                  className="group p-3 sm:p-4 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-rose-50/50 hover:border-rose-200 transition-all flex flex-col items-center text-center space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 group-hover:border-rose-300 flex items-center justify-center text-rose-600 shadow-xs group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900 group-hover:text-rose-600">
                      {cat.name}
                    </h4>
                    <span className="text-[10px] text-stone-400 block">{cat.count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED SALONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-rose-600 tracking-wider uppercase">
              Top Rated in Mumbai
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Featured Luxury Salons & Studios
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Verified establishments with accredited staff, transparent pricing, and instant bookings.
            </p>
          </div>

          {/* Area Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {mumbaiLocalities.slice(0, 5).map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedArea(loc)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                  selectedArea === loc
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Salons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSalons.map((salon) => (
            <SalonCard
              key={salon.id}
              salon={salon}
              onBookClick={(s) => setBookingSalon(s)}
            />
          ))}
        </div>

        <div className="text-center pt-6">
          <Link
            href="/salons"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-800 hover:text-rose-600 border border-stone-300 hover:border-rose-300 bg-white px-6 py-3 rounded-xl shadow-xs transition-all"
          >
            <span>View All Mumbai Salons</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* WHY GLAMOURLY */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-stone-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-rose-400 tracking-wider uppercase">
              Trust & Transparency
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Why Discerning Clients Choose Glamourly
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Built for seamless salon bookings with security checks for genuine providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-stone-800/60 p-6 rounded-3xl border border-stone-700/60 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Strict Provider Verification</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Every salon uploaded to Glamourly must submit their municipal trade license or GST certificate. Only verified, genuine owners are approved to accept client bookings.
              </p>
            </div>

            <div className="bg-stone-800/60 p-6 rounded-3xl border border-stone-700/60 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Direct Provider Phone & WhatsApp</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                No middleman hiding contact info. Get the salon manager&apos;s phone number and 1-tap WhatsApp chat on every salon page to clarify doubts, request VIP treatments, or discuss customized packages.
              </p>
            </div>

            <div className="bg-stone-800/60 p-6 rounded-3xl border border-stone-700/60 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Guaranteed Slot Reservation</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Select your preferred stylist and exact 30-minute time slot. Choose to pay online or pay conveniently at the venue upon arrival with free cancellation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SALON OWNER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-rose-900 via-stone-900 to-amber-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              For Salon & Spa Owners in Mumbai
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold">
              List Your Salon on Glamourly Today
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Showcase your services, manage staff schedules, accept appointments, and connect with high-intent beauty and wellness clients across Mumbai.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/provider/dashboard"
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all"
            >
              Open Provider Portal
            </Link>
            <Link
              href="/auth/signin"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all"
            >
              Register Salon
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        salon={bookingSalon}
        isOpen={!!bookingSalon}
        onClose={() => setBookingSalon(null)}
      />
    </div>
  );
}
