import mongoose, { Schema, model, models } from "mongoose";

export interface IReview {
  _id: string;
  salonId: mongoose.Types.ObjectId | string;
  customerId?: mongoose.Types.ObjectId | string;
  bookingId?: mongoose.Types.ObjectId | string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  verifiedBooking: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: "Salon", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User" },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    verifiedBooking: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
