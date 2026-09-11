"use client";

import React, { useState } from "react";
import {
  X,
  Clock,
  User,
  CheckCircle2,
  Phone,
  MapPin,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Banknote,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { MockSalon, MockBooking } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

interface BookingModalProps {
  salon: MockSalon | null;
  isOpen: boolean;
  onClose: () => void;
  preSelectedServiceId?: string;
}

export default function BookingModal({
  salon,
  isOpen,
  onClose,
  preSelectedServiceId,
}: BookingModalProps) {
  // All hooks MUST be before any early return
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preSelectedServiceId || ""
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string>("any");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("11:30 AM");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pay_at_salon" | "online">("pay_at_salon");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<MockBooking | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean; reason?: string }[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);
  const [slotStatusMessage, setSlotStatusMessage] = useState<string>("");

  const selectedService =
    salon?.services?.find((s) => s.id === (selectedServiceId || salon?.services?.[0]?.id)) ||
    salon?.services?.[0];
  const selectedStaff = salon?.staff?.find((st) => st.id === selectedStaffId);

  // Fetch real-time live slots from availability engine whenever salon, date, staff, or service changes
  React.useEffect(() => {
    if (!isOpen || !salon?.id || !selectedDate) return;
    let isCancelled = false;
    setIsCheckingSlots(true);
    setSlotStatusMessage("");

    const duration = selectedService?.durationMinutes || 45;
    fetch(`/api/availability?salonId=${salon.id}&date=${selectedDate}&staffId=${selectedStaffId}&duration=${duration}`)
      .then((res) => res.json())
      .then((data) => {
        if (isCancelled) return;
        if (data.success) {
          if (data.isClosed) {
            setAvailableSlots([]);
            setSlotStatusMessage(data.reason || "Salon is closed on this day.");
          } else if (data.staffOffDuty) {
            setAvailableSlots([]);
            setSlotStatusMessage(data.reason || "Selected stylist is off duty on this day.");
          } else {
            setAvailableSlots(data.availableSlots || []);
            // Auto-select first available slot
            const firstAvailable = (data.availableSlots || []).find((s: any) => s.available);
            if (firstAvailable) {
              setSelectedTimeSlot(firstAvailable.time);
            }
          }
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setAvailableSlots([
            { time: "10:00 AM", available: true },
            { time: "11:30 AM", available: true },
            { time: "02:30 PM", available: true },
            { time: "04:30 PM", available: true },
            { time: "06:30 PM", available: true },
          ]);
        }
      })
      .finally(() => {
        if (!isCancelled) setIsCheckingSlots(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [isOpen, salon?.id, selectedDate, selectedStaffId, selectedService?.durationMinutes]);

  // Early return AFTER all hooks
  if (!isOpen || !salon) return null;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      setErrorMessage("Please provide your Name and Mobile Phone Number.");
      return;
    }
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId: salon.id,
          serviceId: selectedService?.id,
          serviceName: selectedService?.name,
          staffId: selectedStaff ? selectedStaff.id : "any",
          staffName: selectedStaff ? selectedStaff.name : "Any Available Stylist",
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          price: selectedService?.price || 999,
          customerName,
          customerPhone,
          customerEmail: customerEmail || "customer@example.com",
          paymentStatus: paymentMethod === "pay_at_salon" ? "pay_at_salon" : "paid",
          paymentMethod:
            paymentMethod === "pay_at_salon"
              ? "Pay at Salon (Cash / UPI / Card on Arrival)"
              : "Razorpay (Online Card/UPI/Netbanking)",
          notes,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConfirmedBooking(data.data);
        setStep(4);
      } else {
        setErrorMessage(data.error || "Failed to book appointment.");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setConfirmedBooking(null);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-400/40 flex items-center justify-center text-rose-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-white">{salon.name}</h3>
                {salon.isVerified && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-rose-200/80 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-400" /> {salon.address}
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="bg-stone-50 border-b border-stone-200/80 px-6 py-3 flex justify-between items-center text-xs">
            {[
              { n: 1, label: "Service & Stylist" },
              { n: 2, label: "Date & Time" },
              { n: 3, label: "Details & Payment" },
            ].map(({ n, label }, idx) => (
              <React.Fragment key={n}>
                <div className={`flex items-center gap-1.5 font-semibold ${step >= n ? "text-rose-600" : "text-stone-400"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= n ? "bg-rose-100 text-rose-700" : "bg-stone-200 text-stone-700"}`}>
                    {n}
                  </span>
                  <span>{label}</span>
                </div>
                {idx < 2 && <div className="w-8 h-[1px] bg-stone-300" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Select Service & Stylist */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-base font-bold text-stone-900 mb-1">1. Select a Service</h4>
                <p className="text-xs text-stone-500 mb-3">Choose the service you want to book at {salon.name}.</p>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {salon.services.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        (selectedServiceId || salon.services[0]?.id) === srv.id
                          ? "border-rose-600 bg-rose-50/50 shadow-sm"
                          : "border-stone-200 hover:border-rose-200 bg-white"
                      }`}
                    >
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-stone-900">{srv.name}</h5>
                          <span className="text-[10px] uppercase font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                            {srv.category}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{srv.description}</p>
                        <span className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {srv.durationMinutes} mins
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-stone-900 block">{formatPrice(srv.price)}</span>
                        <input
                          type="radio"
                          name="selectedService"
                          checked={(selectedServiceId || salon.services[0]?.id) === srv.id}
                          onChange={() => setSelectedServiceId(srv.id)}
                          className="accent-rose-600 mt-1 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-serif text-base font-bold text-stone-900 mb-1">2. Choose Preferred Stylist</h4>
                <p className="text-xs text-stone-500 mb-3">Select your specialist or &quot;Any Available Stylist&quot;.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setSelectedStaffId("any")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      selectedStaffId === "any" ? "border-rose-600 bg-rose-50/50" : "border-stone-200 hover:border-rose-200 bg-white"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-stone-900">Any Available Stylist</h5>
                      <p className="text-[11px] text-stone-500">Fastest confirmation</p>
                    </div>
                  </div>

                  {salon.staff.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStaffId(st.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        selectedStaffId === st.id ? "border-rose-600 bg-rose-50/50" : "border-stone-200 hover:border-rose-200 bg-white"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-10 h-10 rounded-full object-cover border border-rose-200"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-stone-900">{st.name}</h5>
                        <p className="text-[11px] text-rose-700 font-medium">{st.role}</p>
                        <p className="text-[10px] text-stone-400">{st.experience}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Pick Date & Time Slot */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-base font-bold text-stone-900 mb-1">Select Appointment Date</h4>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-serif text-base font-bold text-stone-900">Select Time Slot</h4>
                  <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    Live Slot Availability
                  </span>
                </div>

                {isCheckingSlots ? (
                  <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                    Checking stylist schedule & salon bookings...
                  </div>
                ) : slotStatusMessage ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-semibold">
                    ⚠️ {slotStatusMessage} Please choose another date or stylist.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        title={slot.reason || "Available for booking"}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border relative ${
                          !slot.available
                            ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed line-through opacity-60"
                            : selectedTimeSlot === slot.time
                            ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:border-rose-300 hover:bg-white"
                        }`}
                      >
                        {slot.time}
                        {!slot.available && (
                          <span className="block text-[9px] no-underline font-normal text-stone-400">Booked</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-900 block">Need a custom time slot?</span>
                  <span className="text-amber-800">Call the salon to confirm VIP bookings.</span>
                </div>
                <a
                  href={`tel:${salon.contactPhone}`}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 shrink-0"
                >
                  <Phone className="w-3 h-3" /> Call
                </a>
              </div>
            </div>
          )}

          {/* STEP 3: Customer Details & Payment */}
          {step === 3 && (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Summary */}
              <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <span className="text-stone-400">Service:</span>
                  <span className="font-bold text-white text-sm">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Date & Time:</span>
                  <span className="font-medium text-amber-300">{selectedDate} at {selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Stylist:</span>
                  <span className="text-stone-200">{selectedStaff ? selectedStaff.name : "Any Available Stylist"}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-stone-800 text-sm">
                  <span className="font-bold text-stone-200">Total:</span>
                  <span className="font-bold text-rose-400 text-base">{formatPrice(selectedService?.price || 0)}</span>
                </div>
              </div>

              {/* Customer Form */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-stone-900">Your Contact Information</h4>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aanya Singhania"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 XXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Special Requests (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Sensitive scalp, preparing for wedding event..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment */}
              <div>
                <h4 className="font-serif text-sm font-bold text-stone-900 mb-2">Payment Option</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod("pay_at_salon")}
                    className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 ${
                      paymentMethod === "pay_at_salon" ? "border-rose-600 bg-rose-50/50" : "border-stone-200 bg-white"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">Pay at Salon (Recommended)</span>
                      <span className="text-[10px] text-stone-500">UPI / Card / Cash on arrival</span>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("online")}
                    className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 ${
                      paymentMethod === "online" ? "border-rose-600 bg-rose-50/50" : "border-stone-200 bg-white"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">Online Payment</span>
                      <span className="text-[10px] text-stone-500">Razorpay (Card/UPI/Netbanking)</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* STEP 4: Success */}
          {step === 4 && confirmedBooking && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">Appointment Confirmed!</h3>
                <p className="text-xs text-stone-500 mt-1">Your booking has been registered with {salon.name}.</p>
              </div>

              <div className="bg-stone-900 text-white rounded-3xl p-6 text-left border border-stone-800 shadow-xl max-w-md mx-auto">
                <div className="flex justify-between items-start border-b border-stone-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400">Booking Pass</span>
                    <h4 className="font-serif text-lg font-bold text-white">{salon.name}</h4>
                  </div>
                  <span className="text-xs font-mono bg-stone-800 text-amber-300 px-2.5 py-1 rounded-md">{confirmedBooking.id}</span>
                </div>

                <div className="py-4 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Service:</span>
                    <span className="font-semibold text-white">{confirmedBooking.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Date & Slot:</span>
                    <span className="font-bold text-amber-300">{confirmedBooking.date} • {confirmedBooking.timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Stylist:</span>
                    <span className="text-stone-200">{confirmedBooking.staffName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Customer:</span>
                    <span className="text-stone-200">{confirmedBooking.customerName} ({confirmedBooking.customerPhone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Payment:</span>
                    <span className="text-emerald-400 font-semibold">{formatPrice(confirmedBooking.price)} — {confirmedBooking.paymentMethod}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                  <div className="text-[11px] text-stone-400">
                    <span>Questions? Call Salon:</span>
                    <a href={`tel:${salon.contactPhone}`} className="block font-bold text-rose-400 hover:underline">
                      {salon.contactPhone}
                    </a>
                  </div>
                  <a
                    href={`https://wa.me/${salon.whatsappNumber || salon.contactPhone.replace(/\D/g, "")}?text=Hi,%20I%20have%20booked%20${encodeURIComponent(confirmedBooking.serviceName)}%20(ID:%20${confirmedBooking.id})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-semibold"
                  >
                    WhatsApp Salon
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex items-center justify-between">
          {step > 1 && step < 4 && (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
              className="text-xs font-semibold text-stone-700 hover:text-stone-900 px-3 py-2 rounded-lg border border-stone-300 hover:bg-white flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}

          {step === 1 && (
            <div className="text-xs text-stone-500">
              Selected: <span className="font-bold text-stone-900">{selectedService?.name}</span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-3">
            {step < 3 && (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4)}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {step === 3 && (
              <button
                type="button"
                onClick={handleBookingSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? "Processing..." : "Confirm & Reserve Slot"}
              </button>
            )}
            {step === 4 && (
              <button
                type="button"
                onClick={handleReset}
                className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-6 py-2.5 rounded-xl"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
