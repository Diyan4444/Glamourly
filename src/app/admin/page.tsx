"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  Phone,
  Mail,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MockSalon } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminVerificationPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [salons, setSalons] = useState<MockSalon[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/salons?all=true");
      const data = await res.json();
      if (data.success) {
        setSalons(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (salonId: string, status: "verified" | "rejected", deleteFromDb = false) => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId,
          status,
          deleteFromDb,
          rejectionReason: deleteFromDb ? "Invalid or prankster submission deleted by admin" : "Verification rejected",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message);
        if (deleteFromDb) {
          setSalons((prev) => prev.filter((s) => s.id !== salonId));
        } else {
          setSalons((prev) =>
            prev.map((s) =>
              s.id === salonId
                ? { ...s, isVerified: status === "verified", verificationStatus: status }
                : s
            )
          );
        }
        setTimeout(() => setActionMessage(""), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSalons = salons.filter((s) => {
    if (filter === "pending") return !s.isVerified;
    if (filter === "verified") return s.isVerified;
    return true;
  });

  if (!authLoading && user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-stone-200 shadow-xl space-y-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Admin Access Restricted
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              This verification dashboard is restricted to designated Glamourly platform administrators. Providers and customers cannot access this area.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/auth/signin"
                className="w-full bg-stone-900 hover:bg-black text-white font-bold text-xs py-3 rounded-xl transition-all"
              >
                Sign In as Administrator
              </Link>
              <Link
                href="/"
                className="w-full text-xs font-semibold text-stone-600 hover:text-stone-900 py-2"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Glamourly Trust & Safety Admin</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Salon Verification & Anti-Fraud Center
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              Verify trade licenses and owner credentials before shops are allowed to accept customer bookings. Reject and delete prankster / invalid submissions immediately.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-stone-800 text-amber-300 px-3.5 py-2 rounded-xl border border-stone-700 font-semibold">
              Pending: {salons.filter((s) => !s.isVerified).length} Submissions
            </span>
          </div>
        </div>

        {actionMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Filter Switcher */}
        <div className="flex items-center gap-2 mb-6 text-xs font-bold">
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === "pending"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            Pending Verification ({salons.filter((s) => !s.isVerified).length})
          </button>
          <button
            onClick={() => setFilter("verified")}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === "verified"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            Verified Salons ({salons.filter((s) => s.isVerified).length})
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === "all"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            All Submissions ({salons.length})
          </button>
        </div>

        {/* Verification Queue */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-stone-500">Loading audit queue...</div>
          ) : filteredSalons.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-sm text-stone-800">No salons in this category</h3>
              <p className="text-xs text-stone-500">All submitted salon branches are audited and processed.</p>
            </div>
          ) : (
            filteredSalons.map((salon) => (
              <div
                key={salon.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Salon Info */}
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-stone-900">{salon.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        salon.isVerified
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {salon.isVerified ? "VERIFIED & LIVE" : "PENDING AUDIT"}
                    </span>
                    <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                      Locality: {salon.area}, Mumbai
                    </span>
                  </div>

                  <p className="text-xs text-stone-500">{salon.address}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    <div className="flex items-center gap-1.5 text-stone-700">
                      <Phone className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>Phone: <strong>{salon.contactPhone}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-700">
                      <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Email: <strong>{salon.contactEmail || "N/A"}</strong></span>
                    </div>
                    {salon.ownerName && (
                      <div className="flex items-center gap-1.5 text-stone-700">
                        <span className="text-stone-400">👤 Owner/Manager:</span>
                        <strong>{salon.ownerName}</strong>
                      </div>
                    )}
                    {salon.yearsInBusiness && (
                      <div className="flex items-center gap-1.5 text-stone-700">
                        <span className="text-stone-400">⏱️ In Business:</span>
                        <strong>{salon.yearsInBusiness} year(s)</strong>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-stone-700 sm:col-span-2">
                      <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Trade License:{" "}
                        <strong className="font-mono bg-white px-2 py-0.5 rounded border border-stone-200">
                          {salon.businessLicenseNumber || "Pending submission"}
                        </strong>
                      </span>
                    </div>
                    {(salon.gstNumber || salon.panNumber) && (
                      <div className="flex flex-wrap items-center gap-3 text-stone-700 sm:col-span-2 text-[11px]">
                        {salon.gstNumber && (
                          <span>GSTIN: <strong className="font-mono">{salon.gstNumber}</strong></span>
                        )}
                        {salon.panNumber && (
                          <span>PAN: <strong className="font-mono">{salon.panNumber}</strong></span>
                        )}
                        {salon.totalChairs && (
                          <span>Chairs/Stations: <strong>{salon.totalChairs}</strong></span>
                        )}
                      </div>
                    )}
                    {salon.amenities && salon.amenities.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 sm:col-span-2 pt-1 border-t border-stone-200/60">
                        <span className="text-[10px] text-stone-400 font-bold uppercase">Amenities:</span>
                        {salon.amenities.map((a, i) => (
                          <span key={i} className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded-full text-stone-700">
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Audit Actions */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {!salon.isVerified ? (
                    <>
                      <button
                        onClick={() => handleVerify(salon.id, "verified")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <ShieldCheck className="w-4 h-4" /> Approve & Make Live
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to reject and permanently delete "${salon.name}" from the database?`)) {
                            handleVerify(salon.id, "rejected", true);
                          }
                        }}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Reject & Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        if (confirm(`Revoke verification for "${salon.name}"? It will be removed from public customer view.`)) {
                          handleVerify(salon.id, "rejected", false);
                        }
                      }}
                      className="text-stone-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold px-3.5 py-2 rounded-xl border border-stone-200 transition-all"
                    >
                      Revoke Verification
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
