import { NextResponse } from "next/server";
import { addStaff, deleteStaff } from "@/lib/dbService";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { requestingUserId, ...staffData } = body;

    if (!staffData.name || !staffData.role) {
      return NextResponse.json(
        { success: false, error: "Staff name and role are required." },
        { status: 400 }
      );
    }

    const newStaff = await addStaff(
      params.id,
      {
        ...staffData,
        experience: staffData.experience || "3+ Years",
        avatar:
          staffData.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        workingDays: staffData.workingDays || [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      },
      requestingUserId
    );

    return NextResponse.json({ success: true, data: newStaff });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get("staffId");
    const requestingUserId = searchParams.get("requestingUserId") || undefined;

    if (!staffId) {
      return NextResponse.json(
        { success: false, error: "Staff ID is required." },
        { status: 400 }
      );
    }

    await deleteStaff(params.id, staffId, requestingUserId);
    return NextResponse.json({ success: true, message: "Staff member removed." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
