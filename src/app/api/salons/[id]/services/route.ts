import { NextResponse } from "next/server";
import { addService, deleteService } from "@/lib/dbService";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { requestingUserId, ...serviceData } = body;

    if (!serviceData.name || !serviceData.price || !serviceData.category) {
      return NextResponse.json(
        { success: false, error: "Service name, price, and category are required." },
        { status: 400 }
      );
    }

    const newService = await addService(params.id, serviceData, requestingUserId);
    return NextResponse.json({ success: true, data: newService });
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
    const serviceId = searchParams.get("serviceId");
    const requestingUserId = searchParams.get("requestingUserId") || undefined;

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: "Service ID is required." },
        { status: 400 }
      );
    }

    await deleteService(params.id, serviceId, requestingUserId);
    return NextResponse.json({ success: true, message: "Service deleted." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
