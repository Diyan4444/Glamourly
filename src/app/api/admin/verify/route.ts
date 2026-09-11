import { NextResponse } from "next/server";
import { verifySalon, deleteSalon } from "@/lib/dbService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { salonId, status, rejectionReason, deleteFromDb } = body;

    if (!salonId || !["verified", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Valid salonId and status ('verified' | 'rejected') are required." },
        { status: 400 }
      );
    }

    if (status === "rejected" && deleteFromDb) {
      const removed = await deleteSalon(salonId);
      return NextResponse.json({
        success: true,
        removed: true,
        message: "Rejected salon and removed invalid / unverified data from database.",
      });
    }

    const result = await verifySalon(salonId, status, rejectionReason, false);
    return NextResponse.json({
      success: true,
      message:
        status === "verified"
          ? `Salon "${result.salon?.name}" is now verified and live for customer bookings!`
          : `Salon "${result.salon?.name}" verification marked as rejected.`,
      data: result.salon,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
