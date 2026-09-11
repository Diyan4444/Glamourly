"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Filter,
  Star,
  Sparkles,
  X,
  RotateCcw,
  Store,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  FileCheck,
  Users,
} from "lucide-react";
import Navbar, { MUMBAI_LOCALITIES } from "@/components/Navbar";
import Footer from "@/components/Footer";
import SalonCard from "@/components/SalonCard";
import BookingModal from "@/components/BookingModal";
import { MockSalon } from "@/lib/mockData";

function SalonsContent() {
  const searchParams = useSearchParams();
  const initialArea = searchParams.get("area") || "All";
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("query") || searchParams.get("q") || "";

  const [salons, setSalons] = useState<MockSalon[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "reviews">("rating");
  const [activeBookingSalon, setActiveBookingSalon] = useState<MockSalon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    "All",
    "Hair",
    "Skin",
    "Nails",
    "Bridal",
    "Spa",
    "Makeup",
  ];

  useEffect(() => {
    fetchSalons();
  }, [selectedArea, selectedCategory, minRating, sortBy]);

  const fetchSalons = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedArea !== "All" && selectedArea !== "Mumbai (All)") {
        params.append("area", selectedArea);
      }
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (searchQuery) params.append("query", searchQuery);

      // Only fetch verified salons for public view
      const res = await fetch(`/api/salons?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        let result: MockSalon[] = data.data;

        // Rating filter
        if (minRating > 0) {
          result = result.filter((s) => s.rating >= minRating);
        }

        // Sorting
        if (sortBy === "rating") {
          result.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === "reviews") {
          result.sort((a, b) => b.reviewCount - a.reviewCount);
        } else if (sortBy === "price_asc") {
          result.sort((a, b) => {
            const minA = a.services.length ? Math.min(...a.services.map((s) => s.price)) : 0;
            const minB = b.services.length ? Math.min(...b.services.map((s) => s.price)) : 0;
            return minA - minB;
          });
        }

        setSalons(result);
      }
    } catch (e) {
      console.error("Failed to load salons", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSalons();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedArea("All");
    setSelectedCategory("All");
    setMinRating(0);
    setSortBy("rating");
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ========================================================================= */}
        {/* 🌟 PROVIDER ONBOARDING & BRANCH REGISTRATION GUIDE SECTION                */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-900/40 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs px-3.5 py-1 rounded-full font-bold">
                  <Store className="w-3.5 h-3.5 text-amber-400" />
                  <span>Salon & Spa Owners • Mumbai Marketplace</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Add Your Salon Branch to Glamourly
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                  Want your salon to accept verified client bookings? Register your branch below. Every submission is audited by our trust & safety team to prevent unauthorized listings.
                </p>
              </div>

              <Link
                href="/provider/dashboard"
                className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 shrink-0 justify-center"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Apply as Salon Provider</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 4-Step Branch Approval Lifecycle Explainer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1.5 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h4 className="font-serif text-sm font-bold text-white">Submit Branch Details</h4>
                <p className="text-[11px] text-stone-300 leading-tight">
                  Enter branch name, address, weekly operating hours, contact phone, and trade license / GST.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1.5 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h4 className="font-serif text-sm font-bold text-white">Add Services & Staff</h4>
                <p className="text-[11px] text-stone-300 leading-tight">
                  List treatments with pricing in ₹ and team members with experience (freshers vs master artists).
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1.5 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="font-serif text-sm font-bold text-white">Admin Verification</h4>
                <p className="text-[11px] text-stone-300 leading-tight">
                  Your branch enters the verification queue. Admin audits licenses to verify genuine ownership.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1.5 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <h4 className="font-serif text-sm font-bold text-white">Live for Customers</h4>
                <p className="text-[11px] text-stone-300 leading-tight">
                  Once approved, your branch displays the Verified Badge and accepts instant bookings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CUSTOMER DISCOVERY DIRECTORY                                              */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR FILTERS (Desktop) */}
          <div className="hidden lg:block w-72 shrink-0 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6 sticky top-28">
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <span className="font-serif text-base font-bold text-stone-900 flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-rose-600" /> Filters
                </span>
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Area Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-2 uppercase tracking-wider">
                  Mumbai Locality
                </label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {["All", ...MUMBAI_LOCALITIES.filter((a) => a !== "Mumbai (All)")].map((area) => (
                    <button
                      key={area}
                      onClick={() => setSelectedArea(area)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedArea === area
                          ? "bg-rose-50 text-rose-700 font-bold border border-rose-200"
                          : "text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-2 uppercase tracking-wider">
                  Treatment Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedCategory === cat
                          ? "bg-stone-900 text-white shadow-xs"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-2 uppercase tracking-wider">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[0, 4.0, 4.5, 4.8].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setMinRating(rate)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 border ${
                        minRating === rate
                          ? "bg-amber-500 text-white border-amber-500"
                          : "border-stone-200 text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      <span>{rate === 0 ? "Any" : `${rate}+`}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MAIN SALONS GRID */}
          <div className="flex-1 space-y-6">
            {/* Search Bar & Sort */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 w-full px-2">
                <Search className="w-4 h-4 text-rose-600 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by salon name, styling treatment, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none text-stone-900 placeholder:text-stone-400"
                />
              </form>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                <span className="text-xs text-stone-500 whitespace-nowrap font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="price_asc">Price: Low to High</option>
                </select>
              </div>
            </div>

            {/* Salons List */}
            {isLoading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-stone-600">Loading verified Mumbai salons...</p>
              </div>
            ) : salons.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4 shadow-sm">
                <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                  <Store className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  No verified salons found in &quot;{selectedArea}&quot;
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                  Only admin-approved salons are shown here. If you own a salon in this area, register your branch and submit your trade license to go live.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="text-xs font-bold px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-800"
                  >
                    Clear Filter Selection
                  </button>
                  <Link
                    href="/provider/dashboard"
                    className="text-xs font-bold px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
                  >
                    Add Your Branch
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {salons.map((salon) => (
                  <SalonCard
                    key={salon.id}
                    salon={salon}
                    onBookClick={(s) => setActiveBookingSalon(s)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        salon={activeBookingSalon}
        isOpen={!!activeBookingSalon}
        onClose={() => setActiveBookingSalon(null)}
      />
    </div>
  );
}

export default function SalonsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SalonsContent />
    </Suspense>
  );
}
