import { NextResponse } from "next/server";
import { getAllSalons, createSalon } from "@/lib/dbService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;
    const area = searchParams.get("area") || undefined;
    const category = searchParams.get("category") || undefined;
    const all = searchParams.get("all") === "true"; // For admin to see unverified

    const salons = await getAllSalons({
      query,
      area,
      category,
      onlyVerified: !all,
    });

    return NextResponse.json({ success: true, count: salons.length, data: salons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verification & Security validations
    if (!body.name || !body.address || !body.contactPhone || !body.contactEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: Salon Name, Address, Contact Phone, and Contact Email are mandatory.",
        },
        { status: 400 }
      );
    }

    const salon = await createSalon({
      ...body,
      ownerId: body.ownerId || "provider-demo",
      ownerName: body.ownerName || "Salon Owner",
      area: body.area || "Bandra West",
      city: body.city || "Mumbai",
      state: "Maharashtra",
      pincode: body.pincode || body.zipCode || "400050",
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
      whatsappNumber: body.whatsappNumber || body.contactPhone.replace(/\D/g, ""),
      description: body.description || "",
      tagline: body.tagline || "",
      gstNumber: body.gstNumber || "",
      panNumber: body.panNumber || "",
      totalChairs: Number(body.totalChairs) || 4,
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      yearsInBusiness: Number(body.yearsInBusiness) || 1,
      instagramHandle: body.instagramHandle || "",
      coverImage:
        body.coverImage ||
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
      images: body.images || [],
      businessLicenseNumber: body.businessLicenseNumber || "Pending Submission",
      operatingHours: body.operatingHours || [
        { day: "Monday", open: "10:00 AM", close: "08:00 PM", isClosed: false },
        { day: "Tuesday", open: "10:00 AM", close: "08:00 PM", isClosed: false },
        { day: "Wednesday", open: "10:00 AM", close: "08:00 PM", isClosed: false },
        { day: "Thursday", open: "10:00 AM", close: "08:00 PM", isClosed: false },
        { day: "Friday", open: "10:00 AM", close: "08:00 PM", isClosed: false },
        { day: "Saturday", open: "09:30 AM", close: "09:00 PM", isClosed: false },
        { day: "Sunday", open: "09:30 AM", close: "09:00 PM", isClosed: false },
      ],
      services: body.services || [],
      staff: body.staff || [],
    });

    return NextResponse.json({
      success: true,
      message:
        "Salon submitted successfully! To protect customers from fake listings, your salon will be verified by our safety team before appearing in public searches.",
      data: salon,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
