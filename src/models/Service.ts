import mongoose, { Schema, model, models } from "mongoose";

export interface IService {
  _id: string;
  salonId: mongoose.Types.ObjectId | string;
  name: string;
  category: "Hair" | "Skin" | "Bridal" | "Nails" | "Spa" | "Makeup";
  price: number;
  durationMinutes: number;
  description: string;
  gender: "women" | "men" | "unisex";
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: "Salon", required: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["Hair", "Skin", "Bridal", "Nails", "Spa", "Makeup"],
      required: true,
    },
    price: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
    description: { type: String, required: true },
    gender: {
      type: String,
      enum: ["women", "men", "unisex"],
      default: "unisex",
    },
  },
  { timestamps: true }
);

const Service = models.Service || model<IService>("Service", ServiceSchema);

export default Service;
