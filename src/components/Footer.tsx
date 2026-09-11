import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Phone, Mail, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Glamourly
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Mumbai&apos;s luxury salon & wellness discovery marketplace. Connecting discerning
              clients with genuine, verified salons and master artists across Mumbai.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-rose-300">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Verified Municipal Trade Licenses
              </span>
            </div>
          </div>

          {/* Localities */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-3">Mumbai Localities</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/salons?area=Bandra%20West" className="hover:text-rose-400 transition-colors">
                  Bandra West
                </Link>
              </li>
              <li>
                <Link href="/salons?area=Juhu" className="hover:text-rose-400 transition-colors">
                  Juhu & Vile Parle
                </Link>
              </li>
              <li>
                <Link href="/salons?area=Colaba" className="hover:text-rose-400 transition-colors">
                  Colaba & Fort
                </Link>
              </li>
              <li>
                <Link href="/salons?area=Andheri%20West" className="hover:text-rose-400 transition-colors">
                  Andheri West (Lokhandwala)
                </Link>
              </li>
              <li>
                <Link href="/salons?area=Powai" className="hover:text-rose-400 transition-colors">
                  Powai & Hiranandani
                </Link>
              </li>
              <li>
                <Link href="/salons?area=Worli" className="hover:text-rose-400 transition-colors">
                  Worli & Lower Parel
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-3">Popular Services</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/salons?category=Hair" className="hover:text-rose-400 transition-colors">
                  French Balayage & Highlights
                </Link>
              </li>
              <li>
                <Link href="/salons?category=Hair" className="hover:text-rose-400 transition-colors">
                  Keratin & Hair Botox
                </Link>
              </li>
              <li>
                <Link href="/salons?category=Skin" className="hover:text-rose-400 transition-colors">
                  Hydra Korean Facials
                </Link>
              </li>
              <li>
                <Link href="/salons?category=Nails" className="hover:text-rose-400 transition-colors">
                  Gel Sculpt Nail Art
                </Link>
              </li>
              <li>
                <Link href="/salons?category=Bridal" className="hover:text-rose-400 transition-colors">
                  Bridal Glamour Makeovers
                </Link>
              </li>
              <li>
                <Link href="/salons?category=Spa" className="hover:text-rose-400 transition-colors">
                  Deep Tissue Aromatherapy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Providers */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-3">For Salon Owners</h4>
            <ul className="space-y-2 text-xs text-stone-400 mb-4">
              <li>
                <Link href="/provider/dashboard" className="text-amber-300 hover:text-amber-200 font-semibold">
                  Provider Dashboard →
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-rose-400 transition-colors">
                  Admin Verification Queue
                </Link>
              </li>
            </ul>

            <div className="space-y-1.5 text-xs text-stone-400 border-t border-stone-800 pt-3">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>concierge@glamourly.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Glamourly Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-stone-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-stone-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-stone-300 transition-colors">
              Partner Agreement
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
