"use client";

import React, { useState, useEffect } from "react";
import {
  Store,
  Plus,
  Edit,
  Trash2,
  Users,
  Scissors,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Save,
  AlertCircle,
  X,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import Navbar, { MUMBAI_LOCALITIES } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MockSalon, MockBooking } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

export default function ProviderDashboardPage() {
  const [salons, setSalons] = useState<MockSalon[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<MockSalon | null>(null);
  const [bookings, setBookings] = useState<MockBooking[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "edit-salon" | "services" | "staff" | "bookings" | "new-salon">("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Edit Salon Form State
  const [editName, setEditName] = useState("");
  const [editTagline, setEditTagline] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editArea, setEditArea] = useState("Bandra West");
  const [editPhone, setEditPhone] = useState("");
  const [editWhatsapp, setEditWhatsapp] = useState("");
  const [editCoverImage, setEditCoverImage] = useState("");

  // New Service Form State
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("Haircut");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("45");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServiceGender, setNewServiceGender] = useState<"Unisex" | "Women" | "Men">("Unisex");

  // New Staff Form State
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Senior Hair Stylist");
  const [newStaffExp, setNewStaffExp] = useState("Senior Stylist (4-7 yrs)");
  const [newStaffAvatar, setNewStaffAvatar] = useState("");

  // New Salon (Registration) Form State
  const [regName, setRegName] = useState("");
  const [regTagline, setRegTagline] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regArea, setRegArea] = useState("Bandra West");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regLicense, setRegLicense] = useState("");
  const [regCover, setRegCover] = useState("");
  const [regDesc, setRegDesc] = useState("");

  const mumbaiAreas = MUMBAI_LOCALITIES.filter((a) => a !== "Mumbai (All)");

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    setIsLoading(true);
    try {
      // Fetch all salons including pending ones for the provider
      const res = await fetch("/api/salons?all=true");
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setSalons(data.data);
        const first = data.data[0];
        setSelectedSalon(first);
        populateEditForm(first);
        fetchBookings(first.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const populateEditForm = (salon: MockSalon) => {
    setEditName(salon.name);
    setEditTagline(salon.tagline || "");
    setEditDescription(salon.description || "");
    setEditAddress(salon.address);
    setEditArea(salon.area);
    setEditPhone(salon.contactPhone);
    setEditWhatsapp(salon.whatsappNumber || "");
    setEditCoverImage(salon.coverImage);
  };

  const fetchBookings = async (salonId: string) => {
    try {
      const res = await fetch(`/api/bookings?salonId=${salonId}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSalonSelect = (salon: MockSalon) => {
    setSelectedSalon(salon);
    populateEditForm(salon);
    fetchBookings(salon.id);
  };

  // 1. UPDATE SALON (Provider Editing Own Shop)
  const handleUpdateSalon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSalon) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(`/api/salons/${selectedSalon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          tagline: editTagline,
          description: editDescription,
          address: editAddress,
          area: editArea,
          contactPhone: editPhone,
          whatsappNumber: editWhatsapp || editPhone.replace(/\D/g, ""),
          coverImage: editCoverImage,
          requestingUserId: selectedSalon.ownerId, // Security token / ownership check
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Salon information updated successfully!");
        setSelectedSalon(data.data);
        // update local list
        setSalons((prev) => prev.map((s) => (s.id === data.data.id ? data.data : s)));
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(data.error || "Failed to update salon.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error");
    }
  };

  // 2. ADD SERVICE
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSalon || !newServiceName || !newServicePrice) return;

    try {
      const res = await fetch(`/api/salons/${selectedSalon.id}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newServiceName,
          category: newServiceCategory,
          price: Number(newServicePrice),
          durationMinutes: Number(newServiceDuration),
          description: newServiceDesc || "Professional salon service.",
          gender: newServiceGender,
          requestingUserId: selectedSalon.ownerId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Service added to your menu!");
        const updatedSalon = {
          ...selectedSalon,
          services: [...selectedSalon.services, data.data],
        };
        setSelectedSalon(updatedSalon);
        setSalons((prev) => prev.map((s) => (s.id === updatedSalon.id ? updatedSalon : s)));
        setNewServiceName("");
        setNewServicePrice("");
        setNewServiceDesc("");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(data.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  // 3. DELETE SERVICE
  const handleDeleteService = async (serviceId: string) => {
    if (!selectedSalon) return;
    try {
      const res = await fetch(
        `/api/salons/${selectedSalon.id}/services?serviceId=${serviceId}&requestingUserId=${selectedSalon.ownerId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        const updatedSalon = {
          ...selectedSalon,
          services: selectedSalon.services.filter((s) => s.id !== serviceId),
        };
        setSelectedSalon(updatedSalon);
        setSalons((prev) => prev.map((s) => (s.id === updatedSalon.id ? updatedSalon : s)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4. ADD STAFF
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSalon || !newStaffName) return;

    try {
      const res = await fetch(`/api/salons/${selectedSalon.id}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newStaffName,
          role: newStaffRole,
          experience: newStaffExp,
          avatar:
            newStaffAvatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          requestingUserId: selectedSalon.ownerId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Staff member added!");
        const updatedSalon = {
          ...selectedSalon,
          staff: [...selectedSalon.staff, data.data],
        };
        setSelectedSalon(updatedSalon);
        setSalons((prev) => prev.map((s) => (s.id === updatedSalon.id ? updatedSalon : s)));
        setNewStaffName("");
        setNewStaffAvatar("");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  // 5. REGISTER NEW SALON
  const handleRegisterSalon = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!regName || !regAddress || !regPhone || !regEmail) {
      setErrorMessage("Please fill all required registration fields.");
      return;
    }

    try {
      const res = await fetch("/api/salons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          tagline: regTagline || "Premier Salon & Spa Experience",
          address: regAddress,
          area: regArea,
          contactPhone: regPhone,
          contactEmail: regEmail,
          businessLicenseNumber: regLicense || "GST/MUM/APPLIED",
          coverImage:
            regCover ||
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
          description: regDesc || "Exclusive salon offering top-tier aesthetic and hair treatments.",
          ownerId: `provider-${Date.now()}`,
          ownerName: "Partner Provider",
          services: [
            {
              id: `srv-${Date.now()}-1`,
              name: "Standard Haircut & Wash",
              category: "Haircut",
              price: 800,
              durationMinutes: 45,
              description: "Hair wash and precision styling.",
              gender: "Unisex",
            },
          ],
          staff: [
            {
              id: `stf-${Date.now()}-1`,
              name: "Lead Stylist",
              role: "Senior Hairdresser",
              experience: "5+ Years",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
              workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message);
        setSalons((prev) => [data.data, ...prev]);
        setSelectedSalon(data.data);
        populateEditForm(data.data);
        setActiveTab("overview");
      } else {
        setErrorMessage(data.error || "Failed to register salon.");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  // 6. UPDATE BOOKING STATUS
  const handleUpdateBookingStatus = async (bookingId: string, status: "confirmed" | "completed" | "cancelled") => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-stone-900">
                  Salon Partner Dashboard
                </h1>
                {selectedSalon && (
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                      selectedSalon.isVerified
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {selectedSalon.isVerified ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Shop
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" /> Pending Verification
                      </>
                    )}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                Manage your salon profile, custom services, staff roster, and real-time client bookings.
              </p>
            </div>
          </div>

          {/* Salon Switcher / Add New Button */}
          <div className="flex items-center gap-2">
            {salons.length > 0 && (
              <select
                value={selectedSalon?.id || ""}
                onChange={(e) => {
                  const s = salons.find((item) => item.id === e.target.value);
                  if (s) handleSalonSelect(s);
                }}
                className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-none"
              >
                {salons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.area})
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setActiveTab("new-salon")}
              className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Another Salon
            </button>
          </div>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* SECURITY AUDIT BANNER IF UNVERIFIED */}
        {selectedSalon && !selectedSalon.isVerified && activeTab !== "new-salon" && (
          <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-amber-900">
                  Salon Verification In Progress (Safety Protection)
                </h4>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  To protect Mumbai customers from fake listings and pranksters, new salons undergo a
                  quick background check of business license ({selectedSalon.businessLicenseNumber || "Provided"}).
                  You can set up services and staff now — your shop will be published publicly once verified!
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-amber-200/80 text-amber-900 px-3 py-1 rounded-full whitespace-nowrap">
              Reviewing in &lt; 2 hours
            </span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab("edit-salon")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "edit-salon"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Edit className="w-4 h-4" /> Edit Shop Profile
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "services"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Scissors className="w-4 h-4" /> Services Menu ({selectedSalon?.services.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "staff"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Users className="w-4 h-4" /> Stylist Team ({selectedSalon?.staff.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "bookings"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Calendar className="w-4 h-4" /> Client Bookings ({bookings.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && selectedSalon && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 space-y-2">
                <span className="text-xs text-stone-500 font-medium">Total Bookings</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-stone-900">{bookings.length}</span>
                  <Calendar className="w-5 h-5 text-rose-600" />
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">Active & Confirmed</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 space-y-2">
                <span className="text-xs text-stone-500 font-medium">Total Revenue Volume</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-stone-900">{formatPrice(totalRevenue)}</span>
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-[11px] text-stone-400">Direct from customers</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 space-y-2">
                <span className="text-xs text-stone-500 font-medium">Active Services</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-stone-900">
                    {selectedSalon.services.length}
                  </span>
                  <Scissors className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-[11px] text-stone-400">Listed on your menu</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 space-y-2">
                <span className="text-xs text-stone-500 font-medium">Customer Rating</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-stone-900">
                    {selectedSalon.rating} ★
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    ({selectedSalon.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">Top Rated Status</span>
              </div>
            </div>

            {/* Quick Live Preview Card */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Live Shop Details on Glamourly
                  </h3>
                  <p className="text-xs text-stone-500">
                    This is how customers in {selectedSalon.area} discover your salon.
                  </p>
                </div>
                <a
                  href={`/salons/${selectedSalon.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  View Public Page →
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="space-y-1">
                  <span className="text-stone-400">Salon Name:</span>
                  <p className="font-bold text-stone-900">{selectedSalon.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-stone-400">Address & Area:</span>
                  <p className="font-bold text-stone-900">
                    {selectedSalon.address}, {selectedSalon.area}, Mumbai
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-stone-400">Customer Contact Phone:</span>
                  <p className="font-bold text-rose-600">{selectedSalon.contactPhone}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-stone-400">WhatsApp for Enquiries:</span>
                  <p className="font-bold text-emerald-600">
                    {selectedSalon.whatsappNumber || selectedSalon.contactPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EDIT SALON PROFILE */}
        {activeTab === "edit-salon" && selectedSalon && (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 max-w-3xl shadow-sm">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Edit Salon & Provider Details
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                You have full control over your shop profile, contact numbers, and images. Customers cannot edit these details.
              </p>
            </div>

            <form onSubmit={handleUpdateSalon} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Salon Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Tagline / Highlights
                </label>
                <input
                  type="text"
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  placeholder="e.g. Premier Hair & Skin Studio in Bandra"
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Mumbai Locality / Area *
                  </label>
                  <select
                    value={editArea}
                    onChange={(e) => setEditArea(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:outline-none"
                  >
                    {mumbaiAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Full Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Customer Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-stone-400">
                    Customers use this number to call you with questions.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    placeholder="919820145892"
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Cover Photo Image URL
                </label>
                <input
                  type="url"
                  value={editCoverImage}
                  onChange={(e) => setEditCoverImage(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  About & Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SERVICES MANAGEMENT */}
        {activeTab === "services" && selectedSalon && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Service Form */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 h-fit space-y-4 shadow-sm">
              <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-rose-600" />
                Add New Service
              </h3>
              <form onSubmit={handleAddService} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Balayage & Olaplex"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Category
                    </label>
                    <select
                      value={newServiceCategory}
                      onChange={(e) => setNewServiceCategory(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none"
                    >
                      <option value="Haircut">Haircut</option>
                      <option value="Coloring">Coloring</option>
                      <option value="Styling">Styling</option>
                      <option value="Facial">Facial</option>
                      <option value="Makeup">Makeup</option>
                      <option value="Spa">Spa</option>
                      <option value="Nails">Nails</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="1500"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Duration (Mins)
                    </label>
                    <input
                      type="number"
                      placeholder="45"
                      value={newServiceDuration}
                      onChange={(e) => setNewServiceDuration(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Gender
                    </label>
                    <select
                      value={newServiceGender}
                      onChange={(e) => setNewServiceGender(e.target.value as any)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none"
                    >
                      <option value="Unisex">Unisex</option>
                      <option value="Women">Women</option>
                      <option value="Men">Men</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Includes scalp wash and blow dry styling."
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                >
                  Add to Services Menu
                </button>
              </form>
            </div>

            {/* Existing Services List */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Current Menu Services ({selectedSalon.services.length})
              </h3>

              {selectedSalon.services.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-stone-900">{srv.name}</h4>
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                        {srv.category}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1">{srv.description}</p>
                    <span className="text-[11px] text-stone-400">
                      {srv.durationMinutes} mins • {srv.gender}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-bold text-sm text-stone-900">
                      {formatPrice(srv.price)}
                    </span>
                    <button
                      onClick={() => handleDeleteService(srv.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STAFF MANAGEMENT */}
        {activeTab === "staff" && selectedSalon && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Staff Form */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 h-fit space-y-4 shadow-sm">
              <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-rose-600" />
                Add Stylist / Staff
              </h3>

              <form onSubmit={handleAddStaff} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Staff Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Natasha Sen"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Designation / Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Senior Hairdresser / Makeup Artist"
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Experience Level / Tier *
                  </label>
                  <select
                    value={newStaffExp}
                    onChange={(e) => setNewStaffExp(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    <option value="Fresher / Trainee (0-1 yr)">Fresher / Trainee (0-1 yr)</option>
                    <option value="Junior Stylist (1-3 yrs)">Junior Stylist (1-3 yrs)</option>
                    <option value="Senior Stylist (4-7 yrs)">Senior Stylist (4-7 yrs)</option>
                    <option value="Master Specialist / Director (8+ yrs)">Master Specialist / Director (8+ yrs)</option>
                    <option value="Celebrity & Bridal Artist (10+ yrs)">Celebrity & Bridal Artist (10+ yrs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Photo Avatar URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newStaffAvatar}
                    onChange={(e) => setNewStaffAvatar(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                >
                  Add Team Member
                </button>
              </form>
            </div>

            {/* Staff List */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Active Staff Profiles ({selectedSalon.staff.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedSalon.staff.map((st) => (
                  <div
                    key={st.id}
                    className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center gap-3.5"
                  >
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-12 h-12 rounded-xl object-cover border border-rose-100"
                    />
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-stone-900">{st.name}</h4>
                      <p className="text-xs text-rose-700 font-medium">{st.role}</p>
                      <p className="text-[10px] text-stone-400">{st.experience}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CLIENT BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Appointment Reservations
                </h3>
                <p className="text-xs text-stone-500">
                  Real-time bookings scheduled by customers via Glamourly.
                </p>
              </div>
            </div>

            {bookings.length === 0 ? (
              <p className="text-xs text-stone-400 py-8 text-center">
                No bookings scheduled for this salon yet.
              </p>
            ) : (
              <div className="space-y-3">
                {bookings.map((bk) => (
                  <div
                    key={bk.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
                          {bk.id}
                        </span>
                        <h4 className="font-bold text-sm text-stone-900">{bk.serviceName}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            bk.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : bk.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-stone-200 text-stone-600"
                          }`}
                        >
                          {bk.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                        <span>
                          <strong>Client:</strong> {bk.customerName} ({bk.customerPhone})
                        </span>
                        <span>
                          <strong>Slot:</strong> {bk.date} at {bk.timeSlot}
                        </span>
                        <span>
                          <strong>Stylist:</strong> {bk.staffName}
                        </span>
                      </div>

                      {bk.notes && (
                        <p className="text-[11px] text-stone-500 italic">Notes: &quot;{bk.notes}&quot;</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="font-bold text-sm text-stone-900 block">
                          {formatPrice(bk.price)}
                        </span>
                        <span className="text-[10px] text-stone-400">{bk.paymentMethod}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {bk.status !== "completed" && (
                          <button
                            onClick={() => handleUpdateBookingStatus(bk.id, "completed")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                          >
                            Complete
                          </button>
                        )}
                        {bk.status !== "cancelled" && (
                          <button
                            onClick={() => handleUpdateBookingStatus(bk.id, "cancelled")}
                            className="text-rose-600 hover:bg-rose-50 text-xs font-semibold px-2.5 py-1.5 rounded-lg"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: NEW SALON REGISTRATION */}
        {activeTab === "new-salon" && (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 max-w-3xl shadow-sm">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Register a New Salon Establishment
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Join Mumbai&apos;s verified salon marketplace. Every registration requires a business
                trade license to prevent fake or prank registrations.
              </p>
            </div>

            <form onSubmit={handleRegisterSalon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Salon Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Crown Unisex Salon"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Mumbai Locality *
                  </label>
                  <select
                    value={regArea}
                    onChange={(e) => setRegArea(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:outline-none"
                  >
                    {mumbaiAreas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Shop / Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Shop 4, Linking Road, Near..."
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Business Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 XXXXX"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="manager@salon.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* SECURITY & VALIDATION REQUIREMENT */}
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-amber-900 uppercase">
                  Business Registration / License Number * (Anti-Prank Verification)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH-MUM-EST-2024-XXXXX or GSTIN"
                  value={regLicense}
                  onChange={(e) => setRegLicense(e.target.value)}
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-sm focus:outline-none"
                />
                <p className="text-[11px] text-amber-800">
                  This document confirms you are the legitimate salon owner and prevents unauthorized duplicate listings.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Salon Cover Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={regCover}
                  onChange={(e) => setRegCover(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className="px-4 py-2.5 text-xs font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
                >
                  Submit Salon for Verification
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
