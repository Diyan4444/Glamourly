import mongoose, { Schema, model, models } from "mongoose";

export interface IBooking {
  _id: string;
  customerId: mongoose.Types.ObjectId | string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  salonId: mongoose.Types.ObjectId | string;
  serviceId: mongoose.Types.ObjectId | string;
  staffId?: mongoose.Types.ObjectId | string;
  date: string;
  timeSlot: string;
  price: number;
  status: "confirmed" | "completed" | "cancelled";
  paymentStatus: "paid" | "pay_at_salon" | "pending";
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    salonId: { type: Schema.Types.ObjectId, ref: "Salon", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    staffId: { type: Schema.Types.ObjectId, ref: "Staff" },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "completed", "cancelled"],
      default: "confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pay_at_salon", "pending"],
      default: "pay_at_salon",
    },
    paymentMethod: { type: String, default: "Pay at Salon" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
