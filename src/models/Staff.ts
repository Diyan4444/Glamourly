import mongoose, { Schema, model, models } from "mongoose";

export interface IStaff {
  _id: string;
  salonId: mongoose.Types.ObjectId | string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  experience: string;
  workingDays: string[];
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: "Salon", required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    avatar: { type: String, required: true },
    rating: { type: Number, default: 5.0 },
    experience: { type: String, required: true },
    workingDays: [{ type: String }],
  },
  { timestamps: true }
);

const Staff = models.Staff || model<IStaff>("Staff", StaffSchema);

export default Staff;
