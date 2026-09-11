"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, Phone, ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";
import { MockSalon } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

interface SalonCardProps {
  salon: MockSalon;
  onBookClick?: (salon: MockSalon) => void;
}

export default function SalonCard({ salon, onBookClick }: SalonCardProps) {
  const lowestPrice = salon.services.length
    ? Math.min(...salon.services.map((s) => s.price))
    : 499;

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image & Badges */}
        <div className="relative h-52 w-full overflow-hidden bg-stone-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={salon.coverImage}
            alt={salon.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80";
            }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Verified Badge */}
          {salon.isVerified && (
            <div className="absolute top-3 left-3 bg-emerald-600/95 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Salon
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-stone-900/90 backdrop-blur-md text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{salon.rating}</span>
            <span className="text-stone-400 font-normal">({salon.reviewCount})</span>
          </div>

          {/* Area Pill */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{salon.area}, Mumbai</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="mb-2">
            <Link href={`/salons/${salon.id}`}>
              <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                {salon.name}
              </h3>
            </Link>
            <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{salon.tagline}</p>
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
            {salon.description}
          </p>

          {/* Key Services Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {salon.services.slice(0, 3).map((srv) => (
              <span
                key={srv.id}
                className="text-[11px] bg-rose-50 text-rose-800 font-medium px-2 py-0.5 rounded-md border border-rose-100/60"
              >
                {srv.name}
              </span>
            ))}
            {salon.services.length > 3 && (
              <span className="text-[11px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-md">
                +{salon.services.length - 3} more
              </span>
            )}
          </div>

          {/* Contact Details (Customer Transparency) */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1.5 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Provider Contact:</span>
              <a
                href={`tel:${salon.contactPhone}`}
                className="font-semibold text-rose-600 hover:underline flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                {salon.contactPhone}
              </a>
            </div>
            {salon.whatsappNumber && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Quick WhatsApp:</span>
                <a
                  href={`https://wa.me/${salon.whatsappNumber}?text=Hi%20${encodeURIComponent(
                    salon.name
                  )},%20I%20have%20a%20query%20via%20Glamourly`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  Chat with Owner
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / CTA Buttons */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-stone-500 block uppercase tracking-wider">Starts From</span>
            <span className="text-base font-bold text-stone-900">{formatPrice(lowestPrice)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/salons/${salon.id}`}
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 px-3 py-2 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              Details
            </Link>
            <button
              onClick={() => {
                if (onBookClick) {
                  onBookClick(salon);
                } else {
                  window.location.href = `/salons/${salon.id}#book`;
                }
              }}
              className="text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1"
            >
              <span>Book Slot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
