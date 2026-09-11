import { NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/dbService";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!["confirmed", "completed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus(params.id, status);
    return NextResponse.json({
      success: true,
      message: `Booking updated to ${status}.`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
