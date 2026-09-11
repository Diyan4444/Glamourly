import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileCheck, CheckCircle2, ShieldAlert, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-8">
          <div className="border-b border-stone-100 pb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>User Agreement & Platform Terms</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Terms of Service
            </h1>
            <p className="text-xs text-stone-500">
              Last Updated: September 2026 • Glamourly Technologies Pvt. Ltd. (Mumbai, India)
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600" />
                1. Platform Scope & Marketplace Role
              </h2>
              <p>
                Glamourly is a salon discovery, booking, and appointment coordination platform connecting consumers with independent salon and wellness providers across Mumbai, Maharashtra. Glamourly facilitates scheduling and slot reservation between verified providers and clients.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                2. Salon Provider Verification & Anti-Prank Policy
              </h2>
              <p>
                Every provider submitting a salon branch on Glamourly must provide a valid municipal trade license or GSTIN. Submitting fake, misleading, or unauthorized establishments is strictly prohibited. The platform administrator reserves the right to reject, suspend, or delete any branch submission that fails genuine establishment verification.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                3. Customer Bookings & Cancellations
              </h2>
              <p>
                Appointment reservations made through Glamourly are binding once confirmed by the salon. Customers can choose to pay at the salon or pay online. Cancellations must be made at least 2 hours prior to the scheduled appointment time.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                4. Governing Law & Jurisdiction
              </h2>
              <p>
                These terms are governed by the laws of India. Any disputes arising in connection with Glamourly services are subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
