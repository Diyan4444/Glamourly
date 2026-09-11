import { NextResponse } from "next/server";
import { getSalonById, updateSalon } from "@/lib/dbService";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const salon = await getSalonById(params.id);
    if (!salon) {
      return NextResponse.json({ success: false, error: "Salon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: salon });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { requestingUserId, isAdmin, ...updatedFields } = body;

    const updatedSalon = await updateSalon(
      params.id,
      updatedFields,
      requestingUserId,
      isAdmin
    );

    return NextResponse.json({
      success: true,
      message: "Salon updated successfully.",
      data: updatedSalon,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
