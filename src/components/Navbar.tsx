"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  MapPin,
  Calendar,
  Store,
  ShieldCheck,
  Menu,
  X,
  Phone,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const MUMBAI_LOCALITIES = [
  "Mumbai (All)",
  "Bandra West",
  "Bandra East",
  "Juhu",
  "Colaba",
  "Andheri West",
  "Andheri East",
  "Worli",
  "Lower Parel",
  "Powai",
  "Dadar",
  "Santacruz",
  "Khar",
  "Vile Parle",
  "Chembur",
  "Malad",
  "Borivali",
  "Ghatkopar",
  "Mulund",
  "Thane",
  "Navi Mumbai (Vashi)",
];

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState("Mumbai (All)");

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    const query = area === "Mumbai (All)" ? "" : `?area=${encodeURIComponent(area)}`;
    router.push(`/salons${query}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-950 via-stone-900 to-amber-950 text-amber-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Verified Luxury & Premium Salons across Mumbai</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-rose-200">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              100% Genuine Verified Salons
            </span>
            <span className="flex items-center gap-1 text-xs text-rose-300">
              <Phone className="w-3.5 h-3.5 text-rose-300" />
              Support: care@glamourly.in
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 py-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-md shadow-rose-200 group-hover:scale-105 transition-transform overflow-hidden">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-rose-600 transition-colors">
                Glamourly
              </span>
              <span className="text-[10px] tracking-widest uppercase text-stone-500 font-semibold">
                Mumbai • Salon Marketplace
              </span>
            </div>
          </Link>

          {/* Expanded Location Picker */}
          <div className="hidden lg:flex items-center bg-stone-100/90 hover:bg-stone-200/80 rounded-full px-4 py-2 border border-stone-200 text-xs font-semibold text-stone-800 gap-2 transition-colors">
            <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
            <select
              value={selectedArea}
              onChange={(e) => handleAreaChange(e.target.value)}
              className="bg-transparent text-stone-800 font-medium focus:outline-none cursor-pointer pr-2 max-w-[170px] truncate"
            >
              {MUMBAI_LOCALITIES.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5">
            <Link
              href="/salons"
              className="text-sm font-semibold text-stone-700 hover:text-rose-600 transition-colors"
            >
              Explore Salons
            </Link>

            {/* Provider Link - Dynamic depending on role */}
            {user?.role === "provider" ? (
              <Link
                href="/provider/dashboard"
                className="text-xs font-bold text-amber-900 hover:text-amber-950 transition-colors flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-3.5 py-2 rounded-full hover:bg-amber-100 shadow-2xs"
              >
                <Store className="w-3.5 h-3.5 text-amber-700" />
                Provider Portal
              </Link>
            ) : (
              <Link
                href="/provider/dashboard"
                className="text-xs font-bold text-stone-700 hover:text-amber-900 transition-colors flex items-center gap-1.5 bg-stone-100/80 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 px-3.5 py-2 rounded-full shadow-2xs"
              >
                <Store className="w-3.5 h-3.5 text-amber-600" />
                Become a Provider
              </Link>
            )}

            {/* Customer Appointments */}
            <Link
              href="/account/bookings"
              className="text-sm font-medium text-stone-700 hover:text-rose-600 transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-rose-500" />
              My Appointments
            </Link>

            {/* STRICT ACCESS CONTROL: ONLY ADMIN CAN SEE THIS LINK */}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* User Auth CTA / User Profile Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200/80 px-3.5 py-2 rounded-full border border-stone-200 text-xs font-bold text-stone-800 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-[11px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                      user.role === "admin"
                        ? "bg-rose-600 text-white"
                        : user.role === "provider"
                        ? "bg-amber-600 text-white"
                        : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {user.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="font-bold text-stone-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                    </div>

                    {user.role === "provider" && (
                      <Link
                        href="/provider/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-stone-700 hover:bg-stone-50 font-medium"
                      >
                        <Store className="w-4 h-4 text-amber-600" />
                        Manage My Branch
                      </Link>
                    )}

                    <Link
                      href="/account/bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-stone-700 hover:bg-stone-50 font-medium"
                    >
                      <Calendar className="w-4 h-4 text-rose-600" />
                      My Appointments
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-rose-700 hover:bg-rose-50 font-bold"
                      >
                        <ShieldCheck className="w-4 h-4 text-rose-600" />
                        Admin Verification Queue
                      </Link>
                    )}

                    <div className="border-t border-stone-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          router.push("/");
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-rose-600 hover:bg-rose-50 font-semibold text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-xs font-bold text-stone-700 hover:text-rose-600 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <User className="w-4 h-4 text-stone-500" />
                  Sign In
                </Link>
                <Link
                  href="/salons"
                  className="text-xs font-bold bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white px-4 py-2.5 rounded-full shadow-sm hover:shadow transition-all"
                >
                  Book Slot
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-rose-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-5 pt-4 pb-6 space-y-3 shadow-lg">
          <div className="flex items-center bg-stone-100 rounded-xl p-2.5 gap-2 text-xs">
            <MapPin className="w-4 h-4 text-rose-600" />
            <select
              value={selectedArea}
              onChange={(e) => {
                handleAreaChange(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="bg-transparent font-semibold text-stone-900 focus:outline-none w-full cursor-pointer"
            >
              {MUMBAI_LOCALITIES.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/salons"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-stone-800 font-semibold hover:text-rose-600"
          >
            Explore Salons
          </Link>

          <Link
            href="/account/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-stone-800 font-semibold hover:text-rose-600"
          >
            My Appointments
          </Link>

          {user?.role === "provider" ? (
            <Link
              href="/provider/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-amber-800 font-bold hover:text-amber-900"
            >
              Provider Portal (Salon Owners)
            </Link>
          ) : (
            <Link
              href="/provider/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-amber-700 font-bold hover:text-amber-900"
            >
              Become a Salon Provider
            </Link>
          )}

          {/* Admin link only visible to admin in mobile drawer */}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-rose-700 font-bold"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            {user ? (
              <div className="space-y-2">
                <div className="p-2.5 bg-stone-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-stone-900">{user.name}</p>
                    <p className="text-stone-500 text-[11px]">{user.email}</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-stone-200 px-2 py-0.5 rounded">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    router.push("/");
                  }}
                  className="w-full text-center py-2.5 text-xs text-rose-600 font-bold border border-rose-200 rounded-xl hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs text-stone-800 font-bold border border-stone-300 rounded-xl"
                >
                  Sign In / Register
                </Link>
                <Link
                  href="/salons"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs bg-rose-600 text-white font-bold rounded-xl shadow-sm"
                >
                  Find Nearby Salons
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
