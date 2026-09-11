import mongoose, { Schema, model, models } from "mongoose";

export interface ISalon {
  _id: string;
  ownerId: mongoose.Types.ObjectId | string;
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
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
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
  operatingHours: {
    day: string;
    open: string;
    close: string;
    isClosed?: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SalonSchema = new Schema<ISalon>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    images: [{ type: String }],
    address: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, default: "Mumbai" },
    state: { type: String, default: "Maharashtra" },
    pincode: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [72.8362, 19.0607],
      },
    },
    contactPhone: { type: String, required: true },
    whatsappNumber: { type: String },
    contactEmail: { type: String },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    businessLicenseNumber: { type: String, required: true },
    rejectionReason: { type: String },
    operatingHours: [
      {
        day: { type: String, required: true },
        open: { type: String, required: true },
        close: { type: String, required: true },
        isClosed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

SalonSchema.index({ location: "2dsphere" });
SalonSchema.index({ area: 1 });
SalonSchema.index({ isVerified: 1 });

const Salon = models.Salon || model<ISalon>("Salon", SalonSchema);

export default Salon;
