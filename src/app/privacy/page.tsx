import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-8">
          <div className="border-b border-stone-100 pb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Glamourly Privacy Center</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Privacy Policy
            </h1>
            <p className="text-xs text-stone-500">
              Last Updated: September 2026 • Governing Glamourly Technologies Pvt. Ltd. (Mumbai, India)
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-600" />
                1. Information We Collect
              </h2>
              <p>
                When you use Glamourly to discover salons, register your establishment, or book appointments in Mumbai, we collect:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-stone-600">
                <li><strong>Account details:</strong> Name, email address, phone number, gender, and hashed credentials.</li>
                <li><strong>Salon Provider verification data:</strong> Business Trade License, GSTIN, establishment address, operating hours, and staff information.</li>
                <li><strong>Appointment records:</strong> Selected salon, stylist preferences, service tiers, booking dates, and payment methods.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-600" />
                2. How We Use Your Data
              </h2>
              <p>
                Your information is used strictly to coordinate verified appointments between clients and authorized salon partners, verify legitimate trade licenses to prevent fraudulent listings, and provide instant SMS/WhatsApp confirmation details.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-600" />
                3. Anti-Fraud & Verification Safeguards
              </h2>
              <p>
                All salon branch submissions undergo strict administrative verification of municipal trade licenses before public directory listing. Data from rejected or prankster submissions is permanently deleted from our database.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                4. Data Protection & Contact
              </h2>
              <p>
                We do not sell your personal data to third parties. For data inquiries or account deletion requests, contact our privacy grievance team at <strong className="text-stone-900">privacy@glamourly.in</strong>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
