import { NextResponse } from "next/server";
import { addReview } from "@/lib/dbService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { salonId, userName, rating, comment, customerId, bookingId } = body;

    if (!salonId || !userName || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: "Missing required review fields." },
        { status: 400 }
      );
    }

    const newReview = await addReview(salonId, {
      userName,
      rating: Number(rating),
      comment,
      customerId,
      bookingId,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your review has been published.",
      data: newReview,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
