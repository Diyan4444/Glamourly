export interface MockUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  gender: "male" | "female" | "other" | "prefer_not_to_say";
  phone: string;
  role: "customer" | "provider" | "admin";
  createdAt: string;
}

export interface MockService {
  id: string;
  name: string;
  category: "Hair" | "Skin" | "Bridal" | "Nails" | "Spa" | "Makeup";
  price: number;
  durationMinutes: number;
  description: string;
  gender: "women" | "men" | "unisex";
}

export interface MockStaff {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  experience: string;
  workingDays: string[];
}

export interface MockReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedBooking?: boolean;
}

export interface MockOperatingHours {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

export interface MockSalon {
  id: string;
  ownerId: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  images: string[];
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contactPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  businessLicenseNumber: string;
  rejectionReason?: string;
  ownerName?: string;
  gstNumber?: string;
  panNumber?: string;
  totalChairs?: number;
  amenities?: string[];
  yearsInBusiness?: number;
  instagramHandle?: string;
  services: MockService[];
  staff: MockStaff[];
  reviews: MockReview[];
  operatingHours: MockOperatingHours[];
  createdAt: string;
}

export interface MockBooking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  salonId: string;
  salonName: string;
  salonAddress: string;
  salonPhone: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  date: string;
  timeSlot: string;
  price: number;
  status: "confirmed" | "completed" | "cancelled";
  paymentStatus: "paid" | "pay_at_salon" | "pending";
  paymentMethod: string;
  notes?: string;
  createdAt: string;
}

export const INITIAL_SALONS: MockSalon[] = [
  {
    id: "salon-bandra-01",
    ownerId: "provider-bandra-user",
    name: "Aura Luxury Hair & Spa Studio",
    tagline: "Bespoke Balayage & French Hair Spa Specialists in Bandra",
    description:
      "Aura is Bandra West's premier boutique destination for high-end color treatments, personalized scalp rituals, and European aesthetic styling. Certified L'Oréal Paris and Kérastase master artists.",
    coverImage:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Waterfield Road, Opp. Costa Coffee, Bandra West",
    area: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    coordinates: { lat: 19.0607, lng: 72.8362 },
    contactPhone: "+91 98200 45210",
    whatsappNumber: "919820045210",
    contactEmail: "reservations@aurasalonbandra.in",
    rating: 4.9,
    reviewCount: 128,
    isVerified: true,
    verificationStatus: "verified",
    businessLicenseNumber: "MH-MUM-MCGM-400050-2023",
    services: [
      {
        id: "srv-aura-1",
        name: "Signature French Balayage & Gloss",
        category: "Hair",
        price: 6500,
        durationMinutes: 180,
        description: "Hand-painted organic gradient with customized Olaplex bonding and shine toner.",
        gender: "women",
      },
      {
        id: "srv-aura-2",
        name: "Kérastase Fusio-Dose Scalp Ritual",
        category: "Hair",
        price: 2800,
        durationMinutes: 60,
        description: "Intense deep treatment tailored to hair density, repair, and shine.",
        gender: "unisex",
      },
      {
        id: "srv-aura-3",
        name: "Hydra-Glow Vitamin C Korean Facial",
        category: "Skin",
        price: 3499,
        durationMinutes: 75,
        description: "Deep ultrasonic pore purification with 24K gold serum infusion.",
        gender: "unisex",
      },
      {
        id: "srv-aura-4",
        name: "Gel Sculpt Nail Artistry (Full Set)",
        category: "Nails",
        price: 2200,
        durationMinutes: 90,
        description: "Russian manicure prep, soft builder gel extensions, and chrome finish.",
        gender: "women",
      },
    ],
    staff: [
      {
        id: "staff-1",
        name: "Arjun Verma",
        role: "Senior Master Colorist & Creative Director",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        rating: 4.95,
        experience: "11 years (Vidal Sassoon London Certified)",
        workingDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      },
      {
        id: "staff-2",
        name: "Zara Merchant",
        role: "Lead Skincare Aesthetician",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        rating: 4.88,
        experience: "8 years (CIDESCO Switzerland Certified)",
        workingDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      },
    ],
    reviews: [
      {
        id: "rev-1",
        userName: "Sneha Kapoor",
        rating: 5,
        comment: "Arjun did the most seamless balayage on my dark brown hair! Best salon in Bandra hands down.",
        date: "2 days ago",
        verifiedBooking: true,
      },
      {
        id: "rev-2",
        userName: "Rhea Deshmukh",
        rating: 5,
        comment: "Loved the hygienic environment and welcoming staff. Direct WhatsApp booking check was super easy!",
        date: "1 week ago",
        verifiedBooking: true,
      },
    ],
    operatingHours: [
      { day: "Monday", open: "10:00 AM", close: "08:30 PM" },
      { day: "Tuesday", open: "10:00 AM", close: "08:30 PM" },
      { day: "Wednesday", open: "10:00 AM", close: "08:30 PM" },
      { day: "Thursday", open: "10:00 AM", close: "08:30 PM" },
      { day: "Friday", open: "10:00 AM", close: "09:00 PM" },
      { day: "Saturday", open: "09:30 AM", close: "09:30 PM" },
      { day: "Sunday", open: "09:30 AM", close: "09:30 PM" },
    ],
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "salon-juhu-02",
    ownerId: "provider-juhu-user",
    name: "Velvet Cut Luxury Grooming & Aesthetics",
    tagline: "Celebrity Hairstyling & Grooming Lounge in Juhu",
    description:
      "Nestled along Juhu Tara Road, Velvet Cut offers VIP private styling lounges, organic beard spas, bridal glam suites, and advanced skin rejuvenation therapies.",
    coverImage:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Juhu Tara Road, Near Sea Princess Hotel, Juhu",
    area: "Juhu",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400049",
    coordinates: { lat: 19.0968, lng: 72.8265 },
    contactPhone: "+91 98199 87340",
    whatsappNumber: "919819987340",
    contactEmail: "concierge@velvetcutjuhu.com",
    rating: 4.8,
    reviewCount: 94,
    isVerified: true,
    verificationStatus: "verified",
    businessLicenseNumber: "MH-MUM-MCGM-400049-8812",
    services: [
      {
        id: "srv-velvet-1",
        name: "Executive Precision Haircut & Styling",
        category: "Hair",
        price: 1499,
        durationMinutes: 45,
        description: "Includes head massage, hot towel aromatherapy, and beard sculpture.",
        gender: "unisex",
      },
      {
        id: "srv-velvet-2",
        name: "Anti-Pollution Charcoal Detox Facial",
        category: "Skin",
        price: 2999,
        durationMinutes: 60,
        description: "Removes urban toxins, blackheads, and balances oil production.",
        gender: "unisex",
      },
      {
        id: "srv-velvet-3",
        name: "Deep Tissue Swedish Full Body Massage",
        category: "Spa",
        price: 3999,
        durationMinutes: 90,
        description: "Warm organic sweet almond and lavender oil relaxation therapy.",
        gender: "unisex",
      },
    ],
    staff: [
      {
        id: "staff-3",
        name: "Karan Johar Sharma",
        role: "Head Stylist & Grooming Consultant",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        rating: 4.89,
        experience: "9 years",
        workingDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday", "Sunday"],
      },
    ],
    reviews: [
      {
        id: "rev-3",
        userName: "Vikram Mehta",
        rating: 5,
        comment: "Super premium experience. Karan is amazing with styling. Clean and luxurious.",
        date: "3 days ago",
        verifiedBooking: true,
      },
    ],
    operatingHours: [
      { day: "Monday", open: "10:30 AM", close: "09:00 PM" },
      { day: "Tuesday", open: "10:30 AM", close: "09:00 PM" },
      { day: "Wednesday", open: "10:30 AM", close: "09:00 PM" },
      { day: "Thursday", open: "10:30 AM", close: "09:00 PM" },
      { day: "Friday", open: "10:30 AM", close: "09:30 PM" },
      { day: "Saturday", open: "10:00 AM", close: "09:30 PM" },
      { day: "Sunday", open: "10:00 AM", close: "09:30 PM" },
    ],
    createdAt: "2026-01-15T12:00:00Z",
  },
  {
    id: "salon-colaba-03",
    ownerId: "provider-colaba-user",
    name: "Bloom & Polish South Mumbai Nail & Beauty Bar",
    tagline: "Chic Nail Art, Organic Pedicures & Lash Extensions in Colaba",
    description:
      "Located near Gateway of India, Bloom & Polish brings Paris-inspired manicures, non-toxic organic polishes, and custom lash extensions to South Mumbai's style icons.",
    coverImage:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
    ],
    address: "B.K. Boman Behram Marg, Colaba Causeway",
    area: "Colaba",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    coordinates: { lat: 18.915, lng: 72.8258 },
    contactPhone: "+91 97690 12388",
    whatsappNumber: "919769012388",
    contactEmail: "hello@bloomandpolish.in",
    rating: 4.9,
    reviewCount: 76,
    isVerified: true,
    verificationStatus: "verified",
    businessLicenseNumber: "MH-MUM-MCGM-400001-5509",
    services: [
      {
        id: "srv-bloom-1",
        name: "Luxe Rose Petal Pedicure & Reflexology",
        category: "Spa",
        price: 1850,
        durationMinutes: 60,
        description: "Fresh rose water soak, organic brown sugar scrub, and reflexology pressure therapy.",
        gender: "unisex",
      },
      {
        id: "srv-bloom-2",
        name: "Japanese Silk Russian Volume Lash Extensions",
        category: "Bridal",
        price: 4200,
        durationMinutes: 120,
        description: "Feather-light handmade volume fans for stunning natural or dramatic eyes.",
        gender: "women",
      },
    ],
    staff: [
      {
        id: "staff-4",
        name: "Natasha Fernandez",
        role: "Certified Master Lash & Nail Stylist",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        rating: 4.92,
        experience: "7 years",
        workingDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      },
    ],
    reviews: [
      {
        id: "rev-4",
        userName: "Ananya Singhal",
        rating: 5,
        comment: "Cutest salon in Colaba! The lash extensions are so soft and lightweight.",
        date: "5 days ago",
        verifiedBooking: true,
      },
    ],
    operatingHours: [
      { day: "Monday", open: "11:00 AM", close: "08:00 PM" },
      { day: "Tuesday", open: "11:00 AM", close: "08:00 PM" },
      { day: "Wednesday", open: "11:00 AM", close: "08:00 PM" },
      { day: "Thursday", open: "11:00 AM", close: "08:00 PM" },
      { day: "Friday", open: "11:00 AM", close: "08:30 PM" },
      { day: "Saturday", open: "10:30 AM", close: "08:30 PM" },
      { day: "Sunday", open: "10:30 AM", close: "08:30 PM" },
    ],
    createdAt: "2026-02-01T14:30:00Z",
  },
  {
    id: "salon-andheri-04",
    ownerId: "provider-andheri-user",
    name: "Urban Eden Hair & Skin Lab",
    tagline: "Modern Hair Science, Botox & Texture Transformations in Andheri",
    description:
      "A tech-forward salon offering Brazilian hair botox, nanoplastia, crystal facials, and bridal makeovers for Andheri West.",
    coverImage:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
    ],
    address: "Lokhandwala Complex, Main Market, Andheri West",
    area: "Andheri West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400053",
    coordinates: { lat: 19.1415, lng: 72.8277 },
    contactPhone: "+91 99201 55678",
    whatsappNumber: "919920155678",
    contactEmail: "info@urbanedensalon.com",
    rating: 4.7,
    reviewCount: 52,
    isVerified: true,
    verificationStatus: "verified",
    businessLicenseNumber: "MH-MUM-MCGM-400053-9123",
    services: [
      {
        id: "srv-eden-1",
        name: "Brazilian Keratin Protein Botox Infusion",
        category: "Hair",
        price: 5499,
        durationMinutes: 150,
        description: "Zero formaldehyde deep frizz control and mirror-smooth glass hair finish.",
        gender: "unisex",
      },
    ],
    staff: [
      {
        id: "staff-5",
        name: "Rahul Desai",
        role: "Hair Texture & Rejuvenation Specialist",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        rating: 4.75,
        experience: "6 years",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday", "Sunday"],
      },
    ],
    reviews: [
      {
        id: "rev-5",
        userName: "Pooja Hegde",
        rating: 5,
        comment: "Great experience with keratin hair treatment. Very professional staff!",
        date: "2 weeks ago",
        verifiedBooking: true,
      },
    ],
    operatingHours: [
      { day: "Monday", open: "10:00 AM", close: "09:00 PM" },
      { day: "Tuesday", open: "10:00 AM", close: "09:00 PM" },
      { day: "Wednesday", open: "10:00 AM", close: "09:00 PM" },
      { day: "Thursday", open: "10:00 AM", close: "09:00 PM" },
      { day: "Friday", open: "10:00 AM", close: "09:00 PM" },
      { day: "Saturday", open: "10:00 AM", close: "09:30 PM" },
      { day: "Sunday", open: "10:00 AM", close: "09:30 PM" },
    ],
    createdAt: "2026-02-10T11:00:00Z",
  },
];

export const INITIAL_BOOKINGS: MockBooking[] = [
  {
    id: "GM-BK-8901",
    customerId: "cust-demo-1",
    customerName: "Aanya Singhania",
    customerPhone: "+91 98201 11223",
    customerEmail: "aanya.singhania@gmail.com",
    salonId: "salon-bandra-01",
    salonName: "Aura Luxury Hair & Spa Studio",
    salonAddress: "Waterfield Road, Bandra West, Mumbai",
    salonPhone: "+91 98200 45210",
    serviceId: "srv-aura-1",
    serviceName: "Signature French Balayage & Gloss",
    staffId: "staff-1",
    staffName: "Arjun Verma",
    date: "2026-08-31",
    timeSlot: "11:30 AM",
    price: 6500,
    status: "confirmed",
    paymentStatus: "pay_at_salon",
    paymentMethod: "Pay at Salon (Cash / UPI / Card on Arrival)",
    notes: "Prefers warm honey blonde tones. First time visit.",
    createdAt: "2026-08-24T10:00:00Z",
  },
  {
    id: "GM-BK-7643",
    customerId: "cust-demo-1",
    customerName: "Aanya Singhania",
    customerPhone: "+91 98201 11223",
    customerEmail: "aanya.singhania@gmail.com",
    salonId: "salon-juhu-02",
    salonName: "Velvet Cut Luxury Grooming & Aesthetics",
    salonAddress: "Juhu Tara Road, Juhu, Mumbai",
    salonPhone: "+91 98199 87340",
    serviceId: "srv-velvet-2",
    serviceName: "Anti-Pollution Charcoal Detox Facial",
    staffId: "staff-3",
    staffName: "Karan Johar Sharma",
    date: "2026-08-28",
    timeSlot: "04:30 PM",
    price: 2999,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Razorpay (UPI / Card)",
    notes: "Evening slot.",
    createdAt: "2026-08-20T14:30:00Z",
  },
];

export const INITIAL_USERS: MockUser[] = [
  {
    id: "user-admin-diyan",
    name: "Diyan Shah (Admin)",
    email: "diyanshah2301@gmail.com",
    password: "adminpassword123",
    gender: "prefer_not_to_say",
    phone: "+91 98200 99999",
    role: "admin",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "provider-bandra-user",
    name: "Aura Salon Owner",
    email: "owner@aurasalon.in",
    password: "password123",
    gender: "female",
    phone: "+91 98200 45210",
    role: "provider",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "cust-demo-1",
    name: "Aanya Singhania",
    email: "aanya.singhania@gmail.com",
    password: "password123",
    gender: "female",
    phone: "+91 98201 11223",
    role: "customer",
    createdAt: "2026-01-15T00:00:00Z",
  },
];
