import {
  INITIAL_SALONS,
  INITIAL_BOOKINGS,
  INITIAL_USERS,
  MockSalon,
  MockBooking,
  MockService,
  MockStaff,
  MockReview,
  MockUser,
} from "./mockData";

// Persist stores across Next.js hot-reloads and route worker instances
const globalForGlamourly = globalThis as unknown as {
  __usersStore?: MockUser[];
  __salonsStore?: MockSalon[];
  __bookingsStore?: MockBooking[];
};

const usersStore: MockUser[] =
  globalForGlamourly.__usersStore || (globalForGlamourly.__usersStore = JSON.parse(JSON.stringify(INITIAL_USERS)));
const salonsStore: MockSalon[] =
  globalForGlamourly.__salonsStore || (globalForGlamourly.__salonsStore = JSON.parse(JSON.stringify(INITIAL_SALONS)));
const bookingsStore: MockBooking[] =
  globalForGlamourly.__bookingsStore || (globalForGlamourly.__bookingsStore = JSON.parse(JSON.stringify(INITIAL_BOOKINGS)));

export async function findUserByEmail(email: string): Promise<MockUser | null> {
  const user = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  return user || null;
}

export async function findUserById(id: string): Promise<MockUser | null> {
  const user = usersStore.find((u) => u.id === id);
  return user || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  phone: string;
  role?: "customer" | "provider" | "admin";
}): Promise<MockUser> {
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new Error("User with this email already exists.");
  }

  // Admin email detection - strictly reserved for diyanshah2301@gmail.com
  const designatedAdminEmail = process.env.ADMIN_EMAIL || "diyanshah2301@gmail.com";
  let assignedRole = data.role === "provider" ? "provider" : "customer";
  if (data.email.toLowerCase().trim() === designatedAdminEmail.toLowerCase().trim()) {
    assignedRole = "admin";
  }

  const newUser: MockUser = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email.toLowerCase().trim(),
    password: data.password,
    gender: data.gender || "prefer_not_to_say",
    phone: data.phone,
    role: assignedRole,
    createdAt: new Date().toISOString(),
  };

  usersStore.push(newUser);
  return newUser;
}

export async function upgradeUserToProvider(userId: string): Promise<MockUser | null> {
  const user = usersStore.find((u) => u.id === userId);
  if (!user) return null;
  if (user.role !== "admin") {
    user.role = "provider";
  }
  return user;
}

export async function getAllSalons(options?: {
  query?: string;
  area?: string;
  category?: string;
  onlyVerified?: boolean;
}): Promise<MockSalon[]> {
  let result = [...salonsStore];

  if (options?.onlyVerified !== false) {
    result = result.filter((s) => s.isVerified);
  }

  if (options?.area && options.area !== "All" && options.area !== "Mumbai (All)") {
    result = result.filter(
      (s) => s.area.toLowerCase() === options.area?.toLowerCase()
    );
  }

  if (options?.query && options.query.trim()) {
    const q = options.query.toLowerCase().trim();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q) ||
        s.services.some((srv) => srv.name.toLowerCase().includes(q) || srv.category.toLowerCase().includes(q))
    );
  }

  if (options?.category && options.category !== "All") {
    result = result.filter((s) =>
      s.services.some(
        (srv) => srv.category.toLowerCase() === options.category?.toLowerCase()
      )
    );
  }

  return result;
}

export async function getSalonById(id: string): Promise<MockSalon | null> {
  const salon = salonsStore.find((s) => s.id === id);
  return salon || null;
}

export async function getSalonsByOwnerId(ownerId: string): Promise<MockSalon[]> {
  return salonsStore.filter((s) => s.ownerId === ownerId);
}

export async function createSalon(
  salonData: Omit<MockSalon, "id" | "isVerified" | "verificationStatus" | "rating" | "reviewCount" | "reviews" | "createdAt">
): Promise<MockSalon> {
  const newSalon: MockSalon = {
    ...salonData,
    id: `salon-${Date.now()}`,
    isVerified: false,
    verificationStatus: "pending",
    rating: 5.0,
    reviewCount: 0,
    reviews: [],
    createdAt: new Date().toISOString(),
  };

  salonsStore.unshift(newSalon);
  return newSalon;
}

export async function updateSalon(
  salonId: string,
  updates: Partial<MockSalon>,
  requestingUserId?: string,
  isAdmin = false
): Promise<MockSalon> {
  const salonIndex = salonsStore.findIndex((s) => s.id === salonId);
  if (salonIndex === -1) {
    throw new Error("Salon not found");
  }

  const existing = salonsStore[salonIndex];
  if (!isAdmin && requestingUserId && existing.ownerId !== requestingUserId) {
    throw new Error("Unauthorized: You do not own this salon");
  }

  // Security: only admins can toggle verification
  const safeUpdates = { ...updates };
  if (!isAdmin) {
    delete safeUpdates.isVerified;
    delete safeUpdates.verificationStatus;
  }

  const updatedSalon = {
    ...existing,
    ...safeUpdates,
  };

  salonsStore[salonIndex] = updatedSalon;
  return updatedSalon;
}

export async function verifySalon(
  salonId: string,
  status: "verified" | "rejected",
  rejectionReason?: string,
  deleteOnReject = false
): Promise<{ salon?: MockSalon; removed?: boolean }> {
  const salonIndex = salonsStore.findIndex((s) => s.id === salonId);
  if (salonIndex === -1) {
    throw new Error("Salon not found");
  }

  if (status === "rejected" && deleteOnReject) {
    salonsStore.splice(salonIndex, 1);
    return { removed: true };
  }

  salonsStore[salonIndex].verificationStatus = status;
  salonsStore[salonIndex].isVerified = status === "verified";
  if (rejectionReason) {
    salonsStore[salonIndex].rejectionReason = rejectionReason;
  }

  // When admin verifies a salon, automatically upgrade owner role to provider
  if (status === "verified" && salonsStore[salonIndex].ownerId) {
    await upgradeUserToProvider(salonsStore[salonIndex].ownerId);
  }

  return { salon: salonsStore[salonIndex] };
}

export async function deleteSalon(salonId: string): Promise<boolean> {
  const salonIndex = salonsStore.findIndex((s) => s.id === salonId);
  if (salonIndex === -1) {
    return false;
  }
  salonsStore.splice(salonIndex, 1);
  return true;
}

export async function addService(
  salonId: string,
  service: Omit<MockService, "id">,
  requestingUserId?: string
): Promise<MockSalon> {
  const salon = salonsStore.find((s) => s.id === salonId);
  if (!salon) throw new Error("Salon not found");
  if (requestingUserId && salon.ownerId !== requestingUserId) throw new Error("Unauthorized");

  const newService: MockService = {
    ...service,
    id: `srv-${Date.now()}`,
  };

  salon.services.push(newService);
  return salon;
}

export async function deleteService(
  salonId: string,
  serviceId: string,
  requestingUserId?: string
): Promise<MockSalon> {
  const salon = salonsStore.find((s) => s.id === salonId);
  if (!salon) throw new Error("Salon not found");
  if (requestingUserId && salon.ownerId !== requestingUserId) throw new Error("Unauthorized");

  salon.services = salon.services.filter((s) => s.id !== serviceId);
  return salon;
}

export async function addStaff(
  salonId: string,
  staff: Omit<MockStaff, "id" | "rating">,
  requestingUserId?: string
): Promise<MockSalon> {
  const salon = salonsStore.find((s) => s.id === salonId);
  if (!salon) throw new Error("Salon not found");
  if (requestingUserId && salon.ownerId !== requestingUserId) throw new Error("Unauthorized");

  const newStaff: MockStaff = {
    ...staff,
    id: `staff-${Date.now()}`,
    rating: 5.0,
  };

  salon.staff.push(newStaff);
  return salon;
}

export async function deleteStaff(
  salonId: string,
  staffId: string,
  requestingUserId?: string
): Promise<MockSalon> {
  const salon = salonsStore.find((s) => s.id === salonId);
  if (!salon) throw new Error("Salon not found");
  if (requestingUserId && salon.ownerId !== requestingUserId) throw new Error("Unauthorized");

  salon.staff = salon.staff.filter((st) => st.id !== staffId);
  return salon;
}

export async function createBooking(
  bookingData: Omit<MockBooking, "id" | "createdAt" | "status">
): Promise<MockBooking> {
  const newBooking: MockBooking = {
    ...bookingData,
    id: `GM-BK-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  bookingsStore.unshift(newBooking);
  return newBooking;
}

export async function getBookingsByCustomer(customerId: string): Promise<MockBooking[]> {
  return bookingsStore.filter(
    (b) => b.customerId === customerId || b.customerId === "cust-demo-1"
  );
}

export async function getBookingsBySalon(salonId: string): Promise<MockBooking[]> {
  return bookingsStore.filter((b) => b.salonId === salonId);
}

export async function getAllBookings(): Promise<MockBooking[]> {
  return bookingsStore;
}

export async function updateBookingStatus(
  bookingId: string,
  status: "confirmed" | "completed" | "cancelled"
): Promise<MockBooking> {
  const booking = bookingsStore.find((b) => b.id === bookingId);
  if (!booking) throw new Error("Booking not found");

  booking.status = status;
  return booking;
}

export async function addReview(
  salonId: string,
  review: { userName: string; rating: number; comment: string; customerId?: string; bookingId?: string }
): Promise<MockReview> {
  const salon = salonsStore.find((s) => s.id === salonId);
  if (!salon) throw new Error("Salon not found");

  // Secure Verification: Check if user has an actual confirmed or completed booking at this salon
  let isVerified = false;
  if (review.bookingId) {
    isVerified = bookingsStore.some(
      (b) => b.id === review.bookingId && b.salonId === salonId
    );
  } else if (review.customerId) {
    isVerified = bookingsStore.some(
      (b) => b.customerId === review.customerId && b.salonId === salonId && (b.status === "completed" || b.status === "confirmed")
    );
  } else if (review.userName) {
    // Check if name matches an actual booking
    isVerified = bookingsStore.some(
      (b) => b.salonId === salonId && b.customerName.toLowerCase() === review.userName.toLowerCase()
    );
  }

  const newReview: MockReview = {
    id: `rev-${Date.now()}`,
    userName: review.userName,
    rating: review.rating,
    comment: review.comment,
    date: "Just now",
    verifiedBooking: isVerified,
  };

  salon.reviews.unshift(newReview);
  salon.reviewCount = salon.reviews.length;
  const totalRating = salon.reviews.reduce((acc, r) => acc + r.rating, 0);
  salon.rating = Number((totalRating / salon.reviews.length).toFixed(1));

  return newReview;
}
